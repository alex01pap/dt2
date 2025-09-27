import type { Meta, StoryObj } from '@storybook/react';
import { KPIWidget } from './KPIWidget';
import { DollarSign, Users, Target, Zap } from 'lucide-react';

const meta: Meta<typeof KPIWidget> = {
  title: 'Analytics/KPIWidget',
  component: KPIWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Revenue: Story = {
  args: {
    title: 'Monthly Revenue',
    icon: DollarSign,
    data: {
      current: 45680,
      previous: 42300,
      format: 'currency',
      precision: 0,
    },
    description: 'Total revenue this month',
  },
};

export const WithTarget: Story = {
  args: {
    title: 'Energy Efficiency',
    icon: Zap,
    data: {
      current: 87.5,
      previous: 84.2,
      format: 'percentage',
      precision: 1,
      target: {
        value: 90,
        label: 'Target 90%',
        type: 'minimum',
      },
    },
    description: 'System efficiency score',
  },
};

export const ActiveUsers: Story = {
  args: {
    title: 'Active Users',
    icon: Users,
    data: {
      current: 2847,
      previous: 3120,
      format: 'number',
      precision: 0,
    },
    period: 'vs last week',
    description: 'Current active users',
  },
};

export const Compact: Story = {
  args: {
    title: 'CPU Usage',
    data: {
      current: 68.4,
      previous: 72.1,
      format: 'percentage',
      precision: 1,
    },
    variant: 'compact',
    size: 'sm',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Data',
    data: {
      current: 0,
      format: 'number',
    },
    loading: true,
  },
};

export const NoTrend: Story = {
  args: {
    title: 'Total Assets',
    icon: Target,
    data: {
      current: 156,
      format: 'number',
      precision: 0,
    },
    description: 'Monitored assets',
  },
};

export const LargeNumbers: Story = {
  args: {
    title: 'Data Processed',
    data: {
      current: 2147483648,
      previous: 1932735283,
      format: 'bytes',
      precision: 2,
    },
    size: 'lg',
    description: 'Total data processed today',
  },
};

export const Duration: Story = {
  args: {
    title: 'Avg Response Time',
    data: {
      current: 247,
      previous: 312,
      format: 'duration',
      precision: 0,
    },
    description: 'API response time in seconds',
  },
};