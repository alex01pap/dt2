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
  { x: -5, y: -3, temperature: 22.5 },
  { x: 5, y: -3, temperature: 26.8 },
  { x: 0, y: 0, temperature: 23.1 },
  { x: -3, y: 2, temperature: 21.9 },
  { x: 3, y: 2, temperature: 25.2 },
];

const mockFlowPipes = [
  {
    id: 'chilled-water',
    path: [
      new Vector3(0, 1.5, 5),
      new Vector3(-5, 1, 0),
      new Vector3(5, 1, 0),
    ],
    flowRate: 12.5,
    pressure: 220,
    status: 'normal' as const,
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