import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Clock, Zap, AlertTriangle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'contains' | 'in_range';
  value: string | number;
  secondValue?: string | number; // For range conditions
}

interface Action {
  id: string;
  type: 'send_notification' | 'update_status' | 'trigger_alarm' | 'execute_function' | 'send_email';
  parameters: Record<string, any>;
}

interface WindowConfig {
  enabled: boolean;
  duration: number; // minutes
  debounce: number; // seconds
  aggregation: 'any' | 'all' | 'count';
  threshold?: number; // for count aggregation
}

interface Rule {
  id?: string;
  name: string;
  description?: string;
  conditions: Condition[];
  actions: Action[];
  windowConfig: WindowConfig;
  priority: number;
  enabled: boolean;
}

interface RuleBuilderProps {
  rule?: Rule;
  availableFields?: { key: string; label: string; type: 'number' | 'text' | 'boolean' }[];
  onSave: (rule: Rule) => void;
  onCancel?: () => void;
  className?: string;
}

const defaultRule: Rule = {
  name: '',
  description: '',
  conditions: [],
  actions: [],
  windowConfig: {
    enabled: false,
    duration: 5,
    debounce: 30,
    aggregation: 'any'
  },
  priority: 0,
  enabled: true
};

const operatorLabels = {
  equals: 'Equals',
  not_equals: 'Not Equals',
  greater_than: 'Greater Than',
  less_than: 'Less Than',
  greater_equal: 'Greater or Equal',
  less_equal: 'Less or Equal',
  contains: 'Contains',
  in_range: 'In Range'
};

const actionTypeLabels = {
  send_notification: 'Send Notification',
  update_status: 'Update Status',
  trigger_alarm: 'Trigger Alarm',
  execute_function: 'Execute Function',
  send_email: 'Send Email'
};

const ConditionEditor: React.FC<{
  condition: Condition;
  availableFields: { key: string; label: string; type: 'number' | 'text' | 'boolean' }[];
  onChange: (condition: Condition) => void;
  onDelete: () => void;
}> = ({ condition, availableFields, onChange, onDelete }) => {
  const selectedField = availableFields.find(f => f.key === condition.field);
  const isRangeOperator = condition.operator === 'in_range';

  const handleFieldChange = (field: string) => {
    onChange({ ...condition, field, value: '', secondValue: undefined });
  };

  const handleOperatorChange = (operator: Condition['operator']) => {
    onChange({ ...condition, operator, secondValue: undefined });
  };

  const handleValueChange = (value: string) => {
    const processedValue = selectedField?.type === 'number' ? parseFloat(value) || 0 : value;
    onChange({ ...condition, value: processedValue });
  };

  const handleSecondValueChange = (value: string) => {
    const processedValue = selectedField?.type === 'number' ? parseFloat(value) || 0 : value;
    onChange({ ...condition, secondValue: processedValue });
  };

  const getOperatorsForField = (fieldType: string) => {
    switch (fieldType) {
      case 'number':
        return ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'in_range'];
      case 'text':
        return ['equals', 'not_equals', 'contains'];
      case 'boolean':
        return ['equals', 'not_equals'];
      default:
        return ['equals', 'not_equals'];
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Badge variant="outline">IF</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="ml-auto text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label>Field</Label>
          <Select value={condition.field} onValueChange={handleFieldChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map(field => (
                <SelectItem key={field.key} value={field.key}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Operator</Label>
          <Select value={condition.operator} onValueChange={handleOperatorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {selectedField && getOperatorsForField(selectedField.type).map(op => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op as keyof typeof operatorLabels]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Value</Label>
          <Input
            type={selectedField?.type === 'number' ? 'number' : 'text'}
            value={condition.value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        {isRangeOperator && (
          <div>
            <Label>To Value</Label>
            <Input
              type={selectedField?.type === 'number' ? 'number' : 'text'}
              value={condition.secondValue || ''}
              onChange={(e) => handleSecondValueChange(e.target.value)}
              placeholder="Enter end value"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

const ActionEditor: React.FC<{
  action: Action;
  onChange: (action: Action) => void;
  onDelete: () => void;
}> = ({ action, onChange, onDelete }) => {
  const handleTypeChange = (type: Action['type']) => {
    onChange({ ...action, type, parameters: {} });
  };

  const handleParameterChange = (key: string, value: any) => {
    onChange({
      ...action,
      parameters: { ...action.parameters, [key]: value }
    });
  };

  const renderParameters = () => {
    switch (action.type) {
      case 'send_notification':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={action.parameters.title || ''}
                onChange={(e) => handleParameterChange('title', e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Input
                value={action.parameters.message || ''}
                onChange={(e) => handleParameterChange('message', e.target.value)}
                placeholder="Notification message"
              />
            </div>
          </div>
        );

      case 'update_status':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target</Label>
              <Input
                value={action.parameters.target || ''}
                onChange={(e) => handleParameterChange('target', e.target.value)}
                placeholder="Target entity ID"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={action.parameters.status}
                onValueChange={(value) => handleParameterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'send_email':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Recipients</Label>
              <Input
                value={action.parameters.recipients || ''}
                onChange={(e) => handleParameterChange('recipients', e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={action.parameters.subject || ''}
                onChange={(e) => handleParameterChange('subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Badge variant="outline" className="bg-blue-50 text-blue-700">THEN</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="ml-auto text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Action Type</Label>
          <Select value={action.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(actionTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderParameters()}
      </div>
    </Card>
  );
};

export const RuleBuilder: React.FC<RuleBuilderProps> = ({
  rule: initialRule,
  availableFields = [
    { key: 'temperature', label: 'Temperature', type: 'number' },
    { key: 'pressure', label: 'Pressure', type: 'number' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'online', label: 'Online', type: 'boolean' }
  ],
  onSave,
  onCancel,
  className = ''
}) => {
  const [rule, setRule] = useState<Rule>(initialRule || defaultRule);

  const addCondition = useCallback(() => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  }, []);

  const updateCondition = useCallback((index: number, condition: Condition) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((c, i) => i === index ? condition : c)
    }));
  }, []);

  const deleteCondition = useCallback((index: number) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  }, []);

  const addAction = useCallback(() => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: 'send_notification',
      parameters: {}
    };
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  }, []);

  const updateAction = useCallback((index: number, action: Action) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) => i === index ? action : a)
    }));
  }, []);

  const deleteAction = useCallback((index: number) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (rule.name && rule.conditions.length > 0 && rule.actions.length > 0) {
      onSave(rule);
    }
  }, [rule, onSave]);

  const isValid = rule.name && rule.conditions.length > 0 && rule.actions.length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Rule Builder
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Rule Name *</Label>
            <Input
              value={rule.name}
              onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name"
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Input
              type="number"
              value={rule.priority}
              onChange={(e) => setRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={rule.description}
            onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={rule.enabled}
            onCheckedChange={(enabled) => setRule(prev => ({ ...prev, enabled }))}
          />
          <Label>Enable this rule</Label>
        </div>

        <Separator />

        {/* Conditions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Conditions</h3>
            <Button onClick={addCondition} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>

          <div className="space-y-4">
            {rule.conditions.map((condition, index) => (
              <ConditionEditor
                key={condition.id}
                condition={condition}
                availableFields={availableFields}
                onChange={(updated) => updateCondition(index, updated)}
                onDelete={() => deleteCondition(index)}
              />
            ))}

            {rule.conditions.length === 0 && (
              <Card className="p-6 text-center border-dashed">
                <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Add at least one condition</p>
              </Card>
            )}
          </div>
        </div>

        {/* Window Configuration */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Window & Debounce
          </h3>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Switch
                checked={rule.windowConfig.enabled}
                onCheckedChange={(enabled) => 
                  setRule(prev => ({
                    ...prev,
                    windowConfig: { ...prev.windowConfig, enabled }
                  }))
                }
              />
              <Label>Enable time window configuration</Label>
            </div>

            {rule.windowConfig.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={rule.windowConfig.duration}
                    onChange={(e) =>
                      setRule(prev => ({
                        ...prev,
                        windowConfig: {
                          ...prev.windowConfig,
                          duration: parseInt(e.target.value) || 5
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Debounce (seconds)</Label>
                  <Input
                    type="number"
                    value={rule.windowConfig.debounce}
                    onChange={(e) =>
                      setRule(prev => ({
                        ...prev,
                        windowConfig: {
                          ...prev.windowConfig,
                          debounce: parseInt(e.target.value) || 30
                        }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Aggregation</Label>
                  <Select
                    value={rule.windowConfig.aggregation}
                    onValueChange={(aggregation: 'any' | 'all' | 'count') =>
                      setRule(prev => ({
                        ...prev,
                        windowConfig: { ...prev.windowConfig, aggregation }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any condition</SelectItem>
                      <SelectItem value="all">All conditions</SelectItem>
                      <SelectItem value="count">Count threshold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {rule.windowConfig.aggregation === 'count' && (
                  <div>
                    <Label>Threshold</Label>
                    <Input
                      type="number"
                      value={rule.windowConfig.threshold || 1}
                      onChange={(e) =>
                        setRule(prev => ({
                          ...prev,
                          windowConfig: {
                            ...prev.windowConfig,
                            threshold: parseInt(e.target.value) || 1
                          }
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <Separator />

        {/* Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Actions</h3>
            <Button onClick={addAction} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>

          <div className="space-y-4">
            {rule.actions.map((action, index) => (
              <ActionEditor
                key={action.id}
                action={action}
                onChange={(updated) => updateAction(index, updated)}
                onDelete={() => deleteAction(index)}
              />
            ))}

            {rule.actions.length === 0 && (
              <Card className="p-6 text-center border-dashed">
                <Zap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Add at least one action</p>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!isValid}>
            Save Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleBuilder;