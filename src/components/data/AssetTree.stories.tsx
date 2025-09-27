import type { Meta, StoryObj } from '@storybook/react';
import { AssetTree } from './AssetTree';

const meta: Meta<typeof AssetTree> = {
  title: 'Data/AssetTree',
  component: AssetTree,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onNodeSelect: { action: 'nodeSelected' },
    onNodeAction: { action: 'nodeAction' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAssets = [
  {
    id: 'building-1',
    name: 'Main Building',
    type: 'building' as const,
    status: 'online' as const,
    children: [
      {
        id: 'floor-1',
        name: 'Ground Floor',
        type: 'room' as const,
        status: 'online' as const,
        parentId: 'building-1',
        children: [
          {
            id: 'hvac-1',
            name: 'HVAC System A',
            type: 'equipment' as const,
            status: 'online' as const,
            parentId: 'floor-1',
            children: [
              {
                id: 'temp-1',
                name: 'Temperature Sensor 1',
                type: 'sensor' as const,
                status: 'online' as const,
                parentId: 'hvac-1'
              },
              {
                id: 'pressure-1',
                name: 'Pressure Sensor 1',
                type: 'sensor' as const,
                status: 'warning' as const,
                parentId: 'hvac-1'
              }
            ]
          },
          {
            id: 'lighting-1',
            name: 'Lighting System',
            type: 'equipment' as const,
            status: 'critical' as const,
            parentId: 'floor-1'
          }
        ]
      },
      {
        id: 'floor-2',
        name: 'First Floor',
        type: 'room' as const,
        status: 'offline' as const,
        parentId: 'building-1',
        children: [
          {
            id: 'security-1',
            name: 'Security System',
            type: 'system' as const,
            status: 'online' as const,
            parentId: 'floor-2'
          }
        ]
      }
    ]
  },
  {
    id: 'building-2',
    name: 'Storage Facility',
    type: 'building' as const,
    status: 'warning' as const,
    children: [
      {
        id: 'warehouse-1',
        name: 'Warehouse A',
        type: 'room' as const,
        status: 'online' as const,
        parentId: 'building-2'
      }
    ]
  }
];

export const Default: Story = {
  args: {
    assets: mockAssets,
    selectedNodeId: 'temp-1'
  },
};

export const WithLazyLoading: Story = {
  args: {
    assets: mockAssets,
    lazyLoad: true,
    selectedNodeId: 'hvac-1'
  },
};

export const EmptyState: Story = {
  args: {
    assets: [],
  },
};

export const FlatStructure: Story = {
  args: {
    assets: [
      {
        id: 'sensor-1',
        name: 'Temperature Sensor',
        type: 'sensor',
        status: 'online'
      },
      {
        id: 'sensor-2',
        name: 'Pressure Sensor',
        type: 'sensor',
        status: 'warning'
      },
      {
        id: 'sensor-3',
        name: 'Flow Sensor',
        type: 'sensor',
        status: 'critical'
      }
    ]
  },
};

export const LargeHierarchy: Story = {
  args: {
    assets: [
      ...mockAssets,
      {
        id: 'campus-1',
        name: 'North Campus',
        type: 'building',
        status: 'online',
        children: Array.from({ length: 10 }, (_, i) => ({
          id: `building-${i + 3}`,
          name: `Building ${String.fromCharCode(65 + i)}`,
          type: 'building' as const,
          status: 'online' as const,
          parentId: 'campus-1',
          children: Array.from({ length: 3 }, (_, j) => ({
            id: `room-${i}-${j}`,
            name: `Room ${i + 1}${String.fromCharCode(65 + j)}`,
            type: 'room' as const,
            status: 'online' as const,
            parentId: `building-${i + 3}`
          }))
        }))
      }
    ]
  },
};