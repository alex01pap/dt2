import { useState } from 'react';
import { Plus, Box, Pencil, Trash2, Building2, Tag, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TwinCreatorWizard, TwinConfig } from '@/components/twin/creator/TwinCreatorWizard';
import { useDigitalTwins, DigitalTwin, CreateTwinData } from '@/hooks/useDigitalTwins';
import { getTemplateById, ROOM_TEMPLATES } from '@/components/twin/templates/templateConfig';
import { format } from 'date-fns';

export function DigitalTwinsManager() {
  const { twins, isLoading, createTwin, updateTwin, deleteTwin } = useDigitalTwins();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingTwin, setEditingTwin] = useState<DigitalTwin | null>(null);
  const [deleteConfirmTwin, setDeleteConfirmTwin] = useState<DigitalTwin | null>(null);
  const [editName, setEditName] = useState('');
  const [editBuilding, setEditBuilding] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateComplete = async (config: TwinConfig) => {
    const data: CreateTwinData = {
      name: config.name,
      template_id: config.template.id,
      size: config.size,
      building: config.building,
      tags: config.tags,
    };
    await createTwin(data);
  };

  const handleEditOpen = (twin: DigitalTwin) => {
    setEditingTwin(twin);
    setEditName(twin.name);
    setEditBuilding(twin.building || '');
  };

  const handleEditSave = async () => {
    if (!editingTwin) return;
    setIsSubmitting(true);
    await updateTwin(editingTwin.id, {
      name: editName,
      building: editBuilding || undefined,
    });
    setIsSubmitting(false);
    setEditingTwin(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmTwin) return;
    setIsSubmitting(true);
    await deleteTwin(deleteConfirmTwin.id);
    setIsSubmitting(false);
    setDeleteConfirmTwin(null);
  };

  const getTemplate = (templateId: string) => {
    return getTemplateById(templateId) || ROOM_TEMPLATES[0];
  };

  if (isLoading) {
    return (
      <Card className="card-enterprise">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-enterprise">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Digital Twins</CardTitle>
              <CardDescription>Create and manage your 3D digital twin spaces</CardDescription>
            </div>
            <Button onClick={() => setWizardOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Twin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {twins.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Box className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No digital twins yet</p>
              <p className="text-sm mb-6">Create your first digital twin to get started</p>
              <Button onClick={() => setWizardOpen(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Twin
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {twins.map((twin) => {
                const template = getTemplate(twin.template_id);
                const Icon = template.icon;
                return (
                  <Card key={twin.id} className="group relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 w-full h-1"
                      style={{ backgroundColor: template.previewColor }}
                    />
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${template.previewColor}15`, 
                            color: template.previewColor 
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditOpen(twin)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirmTwin(twin)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-1">{twin.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.name} • {twin.size.charAt(0).toUpperCase() + twin.size.slice(1)}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {twin.building && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3 w-3" />
                            {twin.building}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(twin.created_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {twin.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {twin.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {twin.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{twin.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Wizard */}
      <TwinCreatorWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onComplete={handleCreateComplete}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingTwin} onOpenChange={(open) => !open && setEditingTwin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Digital Twin</DialogTitle>
            <DialogDescription>
              Update the details of your digital twin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter twin name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-building">Building (Optional)</Label>
              <Input
                id="edit-building"
                value={editBuilding}
                onChange={(e) => setEditBuilding(e.target.value)}
                placeholder="e.g., Building A"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTwin(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={!editName.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmTwin} onOpenChange={(open) => !open && setDeleteConfirmTwin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Digital Twin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmTwin?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmTwin(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
