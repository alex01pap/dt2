import type { Meta, StoryObj } from '@storybook/react';
import { RuleBuilder } from './RuleBuilder';

const meta: Meta<typeof RuleBuilder> = {
  title: 'Automation/RuleBuilder',
  component: RuleBuilder,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSave: { action: 'ruleSaved' },
    onCancel: { action: 'cancelled' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockFields = [
  { key: 'temperature', label: 'Temperature', type: 'number' as const },
  { key: 'pressure', label: 'Pressure', type: 'number' as const },
  { key: 'humidity', label: 'Humidity', type: 'number' as const },
  { key: 'status', label: 'Status', type: 'text' as const },
  { key: 'online', label: 'Online', type: 'boolean' as const },
  { key: 'alert_level', label: 'Alert Level', type: 'text' as const },
];

const sampleRule = {
  id: 'rule-1',
  name: 'High Temperature Alert',
  description: 'Trigger alert when temperature exceeds threshold',
  conditions: [
    {
      id: 'condition-1',
      field: 'temperature',
      operator: 'greater_than' as const,
      value: 25
    },
    {
      id: 'condition-2', 
      field: 'humidity',
      operator: 'less_than' as const,
      value: 30
    }
  ],
  actions: [
    {
      id: 'action-1',
      type: 'send_notification' as const,
      parameters: {
        title: 'High Temperature',
        message: 'Temperature has exceeded safe threshold'
      }
    },
    {
      id: 'action-2',
      type: 'send_email' as const,
      parameters: {
        recipients: 'admin@company.com',
        subject: 'Temperature Alert'
      }
    }
  ],
  windowConfig: {
    enabled: true,
    duration: 5,
    debounce: 30,
    aggregation: 'any' as const
  },
  priority: 1,
  enabled: true
};

export const Default: Story = {
  args: {
    availableFields: mockFields
  },
};

export const WithExistingRule: Story = {
  args: {
    rule: sampleRule,
    availableFields: mockFields
  },
};

export const ComplexRule: Story = {
  args: {
    rule: {
      id: 'rule-2',
      name: 'System Health Monitor',
      description: 'Comprehensive monitoring rule with multiple conditions and actions',
      conditions: [
        {
          id: 'condition-1',
          field: 'temperature',
          operator: 'in_range',
          value: 20,
          secondValue: 30
        },
        {
          id: 'condition-2',
          field: 'pressure',
          operator: 'greater_equal',
          value: 100
        },
        {
          id: 'condition-3',
          field: 'online',
          operator: 'equals',
          value: 'true'
        }
      ],
      actions: [
        {
          id: 'action-1',
          type: 'update_status',
          parameters: {
            target: 'system-1',
            status: 'online'
          }
        },
        {
          id: 'action-2',
          type: 'trigger_alarm',
          parameters: {
            severity: 'warning',
            duration: 300
          }
        },
        {
          id: 'action-3',
          type: 'execute_function',
          parameters: {
            functionName: 'restart_system',
            parameters: { force: true }
          }
        }
      ],
      windowConfig: {
        enabled: true,
        duration: 10,
        debounce: 60,
        aggregation: 'all',
        threshold: 3
      },
      priority: 2,
      enabled: true
    },
    availableFields: mockFields
  },
};

export const MinimalFields: Story = {
  args: {
    availableFields: [
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'active', label: 'Active', type: 'boolean' }
    ]
  },
};

export const DisabledRule: Story = {
  args: {
    rule: {
      ...sampleRule,
      enabled: false,
      windowConfig: {
        enabled: false,
        duration: 5,
        debounce: 30,
        aggregation: 'any'
      }
    },
    availableFields: mockFields
  },
};

export const WithWindowConfiguration: Story = {
  args: {
    rule: {
      id: 'rule-3',
      name: 'Time-Window Rule',
      description: 'Rule with advanced time window and debounce settings',
      conditions: [
        {
          id: 'condition-1',
          field: 'temperature',
          operator: 'greater_than',
          value: 30
        }
      ],
      actions: [
        {
          id: 'action-1',
          type: 'send_notification',
          parameters: {
            title: 'Sustained High Temperature',
            message: 'Temperature has been high for extended period'
          }
        }
      ],
      windowConfig: {
        enabled: true,
        duration: 15,
        debounce: 120,
        aggregation: 'count',
        threshold: 5
      },
      priority: 3,
      enabled: true
    },
    availableFields: mockFields
  },
};