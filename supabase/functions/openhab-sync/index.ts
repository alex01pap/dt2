import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SSRF Protection: Validate URLs to prevent attacks on internal services
function isValidExternalUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only http and https protocols are allowed' };
    }
    
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost and loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { valid: false, error: 'Localhost URLs are not allowed' };
    }
    
    // Block private IP ranges
    const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (ipv4Match) {
      const [, a, b, c] = ipv4Match.map(Number);
      if (a === 10) return { valid: false, error: 'Private IP addresses are not allowed' };
      if (a === 172 && b >= 16 && b <= 31) return { valid: false, error: 'Private IP addresses are not allowed' };
      if (a === 192 && b === 168) return { valid: false, error: 'Private IP addresses are not allowed' };
      if (a === 169 && b === 254) return { valid: false, error: 'Link-local addresses are not allowed' };
    }
    
    // Block cloud metadata endpoints
    if (hostname === 'metadata.google.internal' || 
        hostname.endsWith('.internal') ||
        hostname === 'metadata') {
      return { valid: false, error: 'Cloud metadata endpoints are not allowed' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// Validate item names to prevent path traversal
function isValidItemName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  // Only allow alphanumeric, underscores, hyphens, colons (OpenHAB uses colons)
  return /^[a-zA-Z0-9_:-]+$/.test(name);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, config_id } = await req.json();

    // Auto-sync doesn't require authentication (called by cron)
    if (action === 'auto-sync') {
      return await autoSyncData(supabaseClient, config_id);
    }

    // All other actions require authentication
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test-connection') {
      return await testConnection(req, supabaseClient, user.id);
    } else if (action === 'fetch-items') {
      return await fetchItems(req, supabaseClient, user.id);
    } else if (action === 'sync-data') {
      return await syncData(req, supabaseClient, user.id);
    } else if (action === 'send-command') {
      return await sendCommand(req, supabaseClient, user.id);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testConnection(req: Request, supabaseClient: any, userId: string) {
  const { openhabUrl, apiToken } = await req.json();

  // Validate URL to prevent SSRF
  const urlValidation = isValidExternalUrl(openhabUrl);
  if (!urlValidation.valid) {
    console.error('URL validation failed:', urlValidation.error);
    return new Response(
      JSON.stringify({ success: false, error: urlValidation.error }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    const response = await fetch(`${openhabUrl}/rest/items`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`OpenHAB returned status ${response.status}`);
    }

    const items = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        itemCount: items.length,
        message: `Successfully connected! Found ${items.length} items.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Connection test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function fetchItems(req: Request, supabaseClient: any, userId: string) {
  // Get user's OpenHAB config
  const { data: config, error: configError } = await supabaseClient
    .from('openhab_config')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (configError || !config) {
    return new Response(
      JSON.stringify({ error: 'No OpenHAB configuration found' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate URL to prevent SSRF
  const urlValidation = isValidExternalUrl(config.openhab_url);
  if (!urlValidation.valid) {
    console.error('Stored URL validation failed:', urlValidation.error);
    return new Response(
      JSON.stringify({ error: `Invalid OpenHAB URL: ${urlValidation.error}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (config.api_token) {
      headers['Authorization'] = `Bearer ${config.api_token}`;
    }

    const response = await fetch(`${config.openhab_url}/rest/items`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`OpenHAB API returned status ${response.status}`);
    }

    const items = await response.json();
    
    // Filter relevant items (numeric types for sensors)
    const sensorTypes = ['Number', 'Number:Temperature', 'Number:Pressure', 'Number:Dimensionless'];
    const relevantItems = items.filter((item: any) => 
      sensorTypes.some(type => item.type?.startsWith(type))
    );

    console.log(`Fetched ${items.length} total items, ${relevantItems.length} sensor-compatible items`);

    return new Response(
      JSON.stringify({ 
        items: relevantItems.map((item: any) => ({
          name: item.name,
          type: item.type,
          label: item.label || item.name,
          state: item.state,
          category: item.category,
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function autoSyncData(supabaseClient: any, configId: string) {
  console.log(`Auto-syncing OpenHAB config ${configId}`);
  
  // Get config by ID (no user auth needed for cron)
  const { data: config, error: configError } = await supabaseClient
    .from('openhab_config')
    .select('*')
    .eq('id', configId)
    .single();

  if (configError || !config || !config.enabled) {
    console.log('Config not found or not enabled');
    return new Response(
      JSON.stringify({ error: 'Config not found or not enabled' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return await performSync(supabaseClient, config, 'automatic');
}

async function syncData(req: Request, supabaseClient: any, userId: string) {
  // Get user's OpenHAB config
  const { data: config, error: configError } = await supabaseClient
    .from('openhab_config')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (configError || !config || !config.enabled) {
    return new Response(
      JSON.stringify({ error: 'OpenHAB sync is not enabled' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return await performSync(supabaseClient, config, 'manual');
}

async function performSync(supabaseClient: any, config: any, syncType: string) {
  // Validate URL to prevent SSRF
  const urlValidation = isValidExternalUrl(config.openhab_url);
  if (!urlValidation.valid) {
    console.error('Stored URL validation failed during sync:', urlValidation.error);
    await supabaseClient
      .from('openhab_sync_log')
      .insert({
        config_id: config.id,
        sync_type: syncType,
        status: 'error',
        items_synced: 0,
        error_message: `Invalid URL: ${urlValidation.error}`,
      });
    return new Response(
      JSON.stringify({ error: `Invalid OpenHAB URL: ${urlValidation.error}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get mapped items
    const { data: mappedItems, error: itemsError } = await supabaseClient
      .from('openhab_items')
      .select('*')
      .eq('config_id', config.id)
      .eq('sync_enabled', true);

    if (itemsError || !mappedItems || mappedItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items configured for sync' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (config.api_token) {
      headers['Authorization'] = `Bearer ${config.api_token}`;
    }

    let syncedCount = 0;
    const errors: string[] = [];

    // Sync each item
    for (const item of mappedItems) {
      // Validate item name to prevent path traversal
      if (!isValidItemName(item.openhab_item_name)) {
        errors.push(`Invalid item name: ${item.openhab_item_name}`);
        continue;
      }

      try {
        const response = await fetch(
          `${config.openhab_url}/rest/items/${encodeURIComponent(item.openhab_item_name)}`,
          { headers }
        );

        if (!response.ok) {
          errors.push(`Failed to fetch ${item.openhab_item_name}: ${response.status}`);
          continue;
        }

        const openhabItem = await response.json();
        const stateValue = openhabItem.state;

        // Skip if state is NULL, UNDEF, or not a number
        if (!stateValue || stateValue === 'NULL' || stateValue === 'UNDEF') {
          continue;
        }

        const numericValue = parseFloat(stateValue.split(' ')[0]); // Handle values like "23.5 °C"
        
        if (isNaN(numericValue)) {
          continue;
        }

        // If sensor_id exists, create a reading
        if (item.sensor_id) {
          const { error: readingError } = await supabaseClient
            .from('sensor_readings')
            .insert({
              sensor_id: item.sensor_id,
              value: numericValue,
              recorded_at: new Date().toISOString(),
            });

          if (readingError) {
            errors.push(`Failed to insert reading for ${item.openhab_item_name}: ${readingError.message}`);
            continue;
          }

          // Update sensor's last_reading
          await supabaseClient
            .from('sensors')
            .update({
              last_reading: numericValue,
              last_reading_at: new Date().toISOString(),
            })
            .eq('id', item.sensor_id);
        }

        // Update item's last value and sync time
        await supabaseClient
          .from('openhab_items')
          .update({
            last_value: stateValue,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        syncedCount++;
      } catch (itemError) {
        const errorMsg = itemError instanceof Error ? itemError.message : 'Unknown error';
        errors.push(`Error syncing ${item.openhab_item_name}: ${errorMsg}`);
      }
    }

    // Update config's last sync time
    await supabaseClient
      .from('openhab_config')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', config.id);

    // Log the sync
    await supabaseClient
      .from('openhab_sync_log')
      .insert({
        config_id: config.id,
        sync_type: syncType,
        status: errors.length > 0 ? 'partial' : 'success',
        items_synced: syncedCount,
        error_message: errors.length > 0 ? errors.join('; ') : null,
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        synced: syncedCount,
        total: mappedItems.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log the failed sync
    await supabaseClient
      .from('openhab_sync_log')
      .insert({
        config_id: config.id,
        sync_type: syncType,
        status: 'error',
        items_synced: 0,
        error_message: errorMessage,
      });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendCommand(req: Request, supabaseClient: any, userId: string) {
  const { itemName, command } = await req.json();

  if (!itemName || command === undefined) {
    return new Response(
      JSON.stringify({ error: 'itemName and command are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate item name to prevent path traversal
  if (!isValidItemName(itemName)) {
    return new Response(
      JSON.stringify({ error: 'Invalid item name. Only alphanumeric characters, underscores, hyphens, and colons are allowed.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get user's OpenHAB config
  const { data: config, error: configError } = await supabaseClient
    .from('openhab_config')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (configError || !config) {
    return new Response(
      JSON.stringify({ error: 'No OpenHAB configuration found' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate URL to prevent SSRF
  const urlValidation = isValidExternalUrl(config.openhab_url);
  if (!urlValidation.valid) {
    console.error('Stored URL validation failed:', urlValidation.error);
    return new Response(
      JSON.stringify({ error: `Invalid OpenHAB URL: ${urlValidation.error}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'text/plain',
    };
    
    if (config.api_token) {
      headers['Authorization'] = `Bearer ${config.api_token}`;
    }

    console.log(`Sending command to ${itemName}: ${command}`);

    const response = await fetch(
      `${config.openhab_url}/rest/items/${encodeURIComponent(itemName)}`,
      {
        method: 'POST',
        headers,
        body: String(command),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenHAB API returned status ${response.status}: ${errorText}`);
    }

    console.log(`Command sent successfully to ${itemName}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Command '${command}' sent to ${itemName}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending command:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
