import type { Meta, StoryObj } from '@storybook/react';
import { SensorCard } from './SensorCard';

const meta: Meta<typeof SensorCard> = {
  title: 'Analytics/SensorCard',
  component: SensorCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'sensor-1',
    name: 'Temperature Sensor A1',
    type: 'Temperature',
    location: 'Room A - HVAC Zone 1',
    isOnline: true,
    currentReading: {
      id: 'reading-1',
      value: 22.5,
      unit: '°C',
      timestamp: new Date(),
      status: 'normal',
    },
    trend: {
      direction: 'up',
      percentage: 2.3,
    },
    thresholds: {
      min: 18,
      max: 26,
      warning: 25,
      critical: 28,
    },
  },
};

export const Warning: Story = {
  args: {
    ...Default.args,
    currentReading: {
      id: 'reading-2',
      value: 25.8,
      unit: '°C',
      timestamp: new Date(),
      status: 'warning',
    },
    trend: {
      direction: 'up',
      percentage: 8.2,
    },
  },
};

export const Critical: Story = {
  args: {
    ...Default.args,
    name: 'Pressure Sensor P3',
    type: 'Pressure',
    currentReading: {
      id: 'reading-3',
      value: 157.2,
      unit: 'kPa',
      timestamp: new Date(),
      status: 'critical',
    },
    trend: {
      direction: 'up',
      percentage: 15.7,
    },
  },
};

export const Offline: Story = {
  args: {
    ...Default.args,
    isOnline: false,
    currentReading: undefined,
    trend: undefined,
  },
};

export const NoData: Story = {
  args: {
    ...Default.args,
    currentReading: undefined,
    trend: undefined,
  },
};

export const StableReading: Story = {
  args: {
    ...Default.args,
    name: 'Humidity Sensor H2',
    type: 'Humidity',
    currentReading: {
      id: 'reading-4',
      value: 45.0,
      unit: '%',
      timestamp: new Date(),
      status: 'normal',
    },
    trend: {
      direction: 'stable',
      percentage: 0.1,
    },
  },
};