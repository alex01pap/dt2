import { motion } from 'framer-motion';
import { RoomTemplate } from '../../templates/templateConfig';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Tag, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ConfigureStepProps {
  template: RoomTemplate;
  name: string;
  onNameChange: (name: string) => void;
  building: string;
  onBuildingChange: (building: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const SUGGESTED_TAGS = [
  'Temperature', 'Humidity', 'CO2', 'Occupancy', 'Light', 'Sound', 'Motion'
];

const BUILDINGS = [
  { id: 'main', name: 'Main Building', nameGr: 'Κεντρικό Κτίριο' },
  { id: 'annex', name: 'Annex Building', nameGr: 'Παράρτημα' },
  { id: 'sports', name: 'Sports Complex', nameGr: 'Αθλητικές Εγκαταστάσεις' },
  { id: 'outdoor', name: 'Outdoor Area', nameGr: 'Εξωτερικός Χώρος' },
];

export function ConfigureStep({
  template,
  name,
  onNameChange,
  building,
  onBuildingChange,
  tags,
  onTagsChange,
}: ConfigureStepProps) {
  const [customTag, setCustomTag] = useState('');

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setCustomTag('');
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      addTag(customTag.trim());
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Give it a name
        </h3>
        <p className="text-muted-foreground">
          Add details to help identify this space
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Space Name *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={template.nameGr}
            className="h-12 text-lg"
            autoFocus
          />
          <p className="text-sm text-muted-foreground">
            e.g., "Room 101", "Αίθουσα Α1", "IT Lab 2"
          </p>
        </div>

        {/* Building Selection */}
        <div className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Building (optional)
          </Label>
          <Select value={building} onValueChange={onBuildingChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select a building..." />
            </SelectTrigger>
            <SelectContent>
              {BUILDINGS.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <span>{b.name}</span>
                  <span className="text-muted-foreground ml-2">({b.nameGr})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sensor Tags */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Sensor Tags
          </Label>
          <p className="text-sm text-muted-foreground">
            What sensors will this space have? You can add more later.
          </p>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-3 py-1.5 gap-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => removeTag(tag)}
              >
                {tag}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            
            {/* Add custom tag input */}
            <div className="flex items-center gap-1">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
                className="h-8 w-28 text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => addTag(customTag.trim())}
                disabled={!customTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Suggested Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
                onClick={() => addTag(tag)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-muted/50 border border-border mt-8"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${template.previewColor}15`, color: template.previewColor }}
            >
              <template.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {name || template.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {BUILDINGS.find(b => b.id === building)?.name || 'No building assigned'}
                {tags.length > 0 && ` • ${tags.length} sensor${tags.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
