import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      try {
        const response = await fetch(
          `${config.openhab_url}/rest/items/${item.openhab_item_name}`,
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
