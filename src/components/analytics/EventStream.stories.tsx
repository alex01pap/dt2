import type { Meta, StoryObj } from '@storybook/react';
import { EventStream } from './EventStream';

const meta: Meta<typeof EventStream> = {
  title: 'Analytics/EventStream',
  component: EventStream,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEventClick: { action: 'eventClicked' },
    onLoadMore: { action: 'loadMore' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvents = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 60000),
    level: 'info' as const,
    title: 'System Status Update',
    description: 'All systems are operating normally. CPU usage at 45%, memory at 67%.',
    source: 'System Monitor',
    category: 'system',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 120000),
    level: 'warning' as const,
    title: 'Temperature Alert',
    description: 'Room A temperature has exceeded normal operating range (26.8°C). Consider adjusting HVAC settings.',
    source: 'HVAC Controller',
    category: 'environment',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 180000),
    level: 'error' as const,
    title: 'Sensor Communication Lost',
    description: 'Lost communication with humidity sensor H_002 in Room B. Last reading received 3 minutes ago.',
    source: 'Sensor Network',
    category: 'hardware',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 240000),
    level: 'success' as const,
    title: 'Backup Completed',
    description: 'Daily backup of sensor data completed successfully. 2.3GB archived to cloud storage.',
    source: 'Backup Service',
    category: 'maintenance',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 300000),
    level: 'info' as const,
    title: 'User Login',
    description: 'Administrator user logged in from 192.168.1.100.',
    source: 'Authentication',
    category: 'security',
  },
];

// Generate more events for virtualization demo
const generateManyEvents = (count: number) => {
  const levels = ['info', 'warning', 'error', 'success'] as const;
  const sources = ['System Monitor', 'HVAC Controller', 'Sensor Network', 'Backup Service', 'Authentication'];
  const titles = [
    'System Status Update', 'Temperature Alert', 'Sensor Reading', 'Backup Completed',
    'User Action', 'Network Event', 'Database Update', 'Maintenance Task'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    timestamp: new Date(Date.now() - i * 60000),
    level: levels[i % levels.length],
    title: `${titles[i % titles.length]} #${i + 1}`,
    description: `This is event #${i + 1} with some sample description text that shows how longer content is handled.`,
    source: sources[i % sources.length],
    category: 'generated',
  }));
};

export const Default: Story = {
  args: {
    events: mockEvents,
    height: 400,
    showFilters: true,
  },
};

export const WithManyEvents: Story = {
  args: {
    events: generateManyEvents(100),
    height: 500,
    showFilters: true,
    hasMore: true,
  },
};

export const Loading: Story = {
  args: {
    events: [],
    loading: true,
    height: 400,
  },
};

export const NoEvents: Story = {
  args: {
    events: [],
    height: 300,
    showFilters: true,
  },
};

export const WithoutFilters: Story = {
  args: {
    events: mockEvents,
    height: 400,
    showFilters: false,
  },
};

export const AutoRefresh: Story = {
  args: {
    events: mockEvents,
    height: 400,
    autoRefresh: true,
    refreshInterval: 3000,
    showFilters: true,
  },
};

export const Compact: Story = {
  args: {
    events: mockEvents.slice(0, 3),
    height: 250,
    showFilters: false,
  },
};