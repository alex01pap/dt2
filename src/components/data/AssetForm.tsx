import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon } from "lucide-react";

const assetFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["building", "room", "equipment", "sensor", "system"]),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  position_x: z.string().optional(),
  position_y: z.string().optional(),
  position_z: z.string().optional(),
  openhab_item: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editAsset?: any;
}

export function AssetForm({ open, onOpenChange, onSuccess, editAsset }: AssetFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [openhabItems, setOpenhabItems] = useState<any[]>([]);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: editAsset?.name || "",
      type: editAsset?.type || "equipment",
      description: editAsset?.description || "",
      parent_id: editAsset?.parent_id || "",
      position_x: editAsset?.position?.x?.toString() || "",
      position_y: editAsset?.position?.y?.toString() || "",
      position_z: editAsset?.position?.z?.toString() || "",
      openhab_item: editAsset?.metadata?.openhab_item || "",
    },
  });

  useEffect(() => {
    if (open) {
      loadAssets();
      loadOpenhabItems();
    }
  }, [open]);

  const loadAssets = async () => {
    const { data } = await supabase.from("assets").select("id, name, type");
    if (data) setAssets(data);
  };

  const loadOpenhabItems = async () => {
    try {
      const { data: config } = await supabase
        .from("openhab_config")
        .select("*")
        .single();
      
      if (config?.enabled) {
        const { data: items } = await supabase
          .from("openhab_items")
          .select("*")
          .eq("config_id", config.id);
        
        if (items) setOpenhabItems(items);
      }
    } catch (error) {
      console.error("Error loading OpenHAB items:", error);
    }
  };

  const onSubmit = async (values: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      const position =
        values.position_x || values.position_y || values.position_z
          ? {
              x: parseFloat(values.position_x || "0"),
              y: parseFloat(values.position_y || "0"),
              z: parseFloat(values.position_z || "0"),
            }
          : null;

      const metadata = {
        ...editAsset?.metadata,
        openhab_item: values.openhab_item || null,
      };

      const assetData = {
        name: values.name,
        type: values.type,
        description: values.description || null,
        parent_id: values.parent_id || null,
        position,
        metadata,
      };

      if (editAsset) {
        const { error } = await supabase
          .from("assets")
          .update(assetData)
          .eq("id", editAsset.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        const { error } = await supabase.from("assets").insert([assetData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Asset created successfully",
        });
      }

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save asset",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editAsset ? "Edit Asset" : "Add New Asset"}</SheetTitle>
          <SheetDescription>
            {editAsset
              ? "Update asset information and OpenHAB connection"
              : "Create a new asset and optionally connect it to OpenHAB"}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Building" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Asset (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} ({asset.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Organize assets in a hierarchy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Asset description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>3D Position (Optional)</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="position_x"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position_y"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position_z"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Z" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {openhabItems.length > 0 && (
              <FormField
                control={form.control}
                name="openhab_item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LinkIcon className="inline h-4 w-4 mr-2" />
                      Connect to OpenHAB Item (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select OpenHAB item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {openhabItems.map((item) => (
                          <SelectItem key={item.id} value={item.openhab_item_name}>
                            {item.openhab_item_label || item.openhab_item_name} (
                            {item.openhab_item_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Link this asset to an OpenHAB item for real-time data
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editAsset ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
