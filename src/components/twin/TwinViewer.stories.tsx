import type { Meta, StoryObj } from '@storybook/react';
import { TwinViewer } from './TwinViewer';
import { Vector3 } from 'three';

const meta: Meta<typeof TwinViewer> = {
  title: 'Twin/TwinViewer',
  component: TwinViewer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSensors = [
  {
    id: 'temp-1',
    name: 'Room A Temp',
    type: 'temperature',
    position: [-5, 0, -3] as [number, number, number],
    value: 22.5,
    unit: '°C',
    status: 'normal' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'temp-2',
    name: 'Room B Temp',  
    type: 'temperature',
    position: [5, 0, -3] as [number, number, number],
    value: 26.8,
    unit: '°C',
    status: 'warning' as const,
    lastUpdated: new Date(),
  },
  {
    id: 'hvac-1',
    name: 'HVAC Unit',
    type: 'power',
    position: [0, 1.5, 5] as [number, number, number],
    value: 3.4,
    unit: 'kW',
    status: 'normal' as const,
    lastUpdated: new Date(),
  },
];

const mockHeatData = [
  { position: [-5, 0.1, -3] as [number, number, number], intensity: 0.5, color: '#44ff44' },
  { position: [5, 0.1, -3] as [number, number, number], intensity: 0.8, color: '#ff6644' },
  { position: [0, 0.1, 0] as [number, number, number], intensity: 0.6, color: '#ffaa44' },
  { position: [-3, 0.1, 2] as [number, number, number], intensity: 0.4, color: '#44ff44' },
  { position: [3, 0.1, 2] as [number, number, number], intensity: 0.7, color: '#ff7744' },
];

const mockFlowPipes = [
  {
    id: 'chilled-water',
    start: [0, 1.5, 5] as [number, number, number],
    end: [5, 1, 0] as [number, number, number],
    radius: 0.1,
    color: '#3b82f6',
    status: 'active' as const,
    type: 'supply',
  },
];

export const Default: Story = {
  args: {
    twinId: 'demo-twin-1',
    sensors: mockSensors,
    heatData: mockHeatData,
    flowPipes: mockFlowPipes,
    className: 'h-96',
  },
};

export const WithHeatOverlay: Story = {
  args: {
    ...Default.args,
    // Heat overlay can be toggled in the viewer controls
  },
};

export const WithFlowPipes: Story = {
  args: {
    ...Default.args,
    // Flow pipes overlay can be toggled in the viewer controls
  },
};

export const NoSensors: Story = {
  args: {
    twinId: 'empty-twin',
    sensors: [],
    heatData: [],
    flowPipes: [],
    className: 'h-96',
  },
};

export const FullHeight: Story = {
  args: {
    ...Default.args,
    className: 'h-screen',
  },
};