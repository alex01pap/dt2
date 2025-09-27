import type { Meta, StoryObj } from '@storybook/react';
import { TwinSidePanel } from './TwinSidePanel';

const meta: Meta<typeof TwinSidePanel> = {
  title: 'Twin/TwinSidePanel',
  component: TwinSidePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSensorSelect: { action: 'sensorSelected' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock sparkline data
const generateSparklineData = (baseValue: number, variance: number = 2) => {
  return Array.from({ length: 24 * 4 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 * 60 * 60 * 1000) + (i * 15 * 60 * 1000)),
    value: baseValue + (Math.random() - 0.5) * variance,
  }));
};

const mockSensors = [
  {
    id: 'temp-room-a',
    name: 'Room A Temperature',
    type: 'temperature',
    currentValue: 22.5,
    unit: '°C',
    status: 'normal' as const,
    trend: 'up' as const,
    trendPercent: 2.3,
    sparklineData: generateSparklineData(22.5, 1.5),
    thresholds: {
      warning: 25,
      critical: 28,
    },
  },
  {
    id: 'temp-room-b',
    name: 'Room B Temperature',
    type: 'temperature', 
    currentValue: 26.8,
    unit: '°C',
    status: 'warning' as const,
    trend: 'up' as const,
    trendPercent: 8.2,
    sparklineData: generateSparklineData(26.8, 2),
    thresholds: {
      warning: 25,
      critical: 28,
    },
  },
  {
    id: 'humidity-a',
    name: 'Room A Humidity',
    type: 'humidity',
    currentValue: 45.2,
    unit: '%',
    status: 'normal' as const,
    trend: 'stable' as const,
    trendPercent: 0.1,
    sparklineData: generateSparklineData(45.2, 3),
    thresholds: {
      warning: 60,
      critical: 70,
    },
  },
  {
    id: 'power-hvac',
    name: 'HVAC Power Consumption',
    type: 'power',
    currentValue: 3.4,
    unit: 'kW',
    status: 'normal' as const,
    trend: 'down' as const,
    trendPercent: 5.1,
    sparklineData: generateSparklineData(3.4, 0.8),
  },
  {
    id: 'pressure-critical',
    name: 'System Pressure',
    type: 'pressure',
    currentValue: 157.2,
    unit: 'kPa',
    status: 'critical' as const,
    trend: 'up' as const,
    trendPercent: 15.7,
    sparklineData: generateSparklineData(157.2, 10),
    thresholds: {
      warning: 150,
      critical: 180,
    },
  },
];

const mockSystemStatus = {
  overall: 'degraded' as const,
  uptime: 156 * 3600, // 156 hours
  lastUpdated: new Date(),
  activeAlerts: 2,
  totalSensors: 5,
  onlineSensors: 4,
};

export const Default: Story = {
  args: {
    twinId: 'demo-twin-1',
    sensors: mockSensors,
    systemStatus: mockSystemStatus,
    className: 'h-96 w-80',
  },
};

export const HealthySystem: Story = {
  args: {
    twinId: 'demo-twin-2',
    sensors: mockSensors.map(s => ({ ...s, status: 'normal' as const })),
    systemStatus: {
      ...mockSystemStatus,
      overall: 'healthy',
      activeAlerts: 0,
      onlineSensors: 5,
    },
    className: 'h-96 w-80',
  },
};

export const CriticalSystem: Story = {
  args: {
    twinId: 'demo-twin-3',
    sensors: mockSensors.map(s => ({ ...s, status: 'critical' as const })),
    systemStatus: {
      ...mockSystemStatus,
      overall: 'critical',
      activeAlerts: 8,
      onlineSensors: 2,
    },
    className: 'h-96 w-80',
  },
};

export const NoSensors: Story = {
  args: {
    twinId: 'empty-twin',
    sensors: [],
    systemStatus: {
      ...mockSystemStatus,
      totalSensors: 0,
      onlineSensors: 0,
      activeAlerts: 0,
    },
    className: 'h-96 w-80',
  },
};

export const FullHeight: Story = {
  args: {
    ...Default.args,
    className: 'h-screen w-80',
  },
};