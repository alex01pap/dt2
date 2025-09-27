import type { Meta, StoryObj } from '@storybook/react';
import { LiveChart } from './LiveChart';

const meta: Meta<typeof LiveChart> = {
  title: 'Charts/LiveChart',
  component: LiveChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onDataPointClick: { action: 'dataPointClicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock time series data
const generateMockData = (count: number, baseValue: number, variance: number) => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * 60000, // 1 minute intervals
    value: baseValue + (Math.random() - 0.5) * variance,
    quality: 0.8 + Math.random() * 0.2 // Quality between 0.8-1.0
  }));
};

const temperatureData = generateMockData(100, 22.5, 5);
const pressureData = generateMockData(100, 101.3, 3);
const humidityData = generateMockData(100, 45, 20);

export const Default: Story = {
  args: {
    title: 'Sensor Readings',
    series: [
      {
        key: 'temperature',
        name: 'Temperature',
        color: '#ff6b6b',
        data: temperatureData,
        unit: '°C'
      },
      {
        key: 'pressure',
        name: 'Pressure',
        color: '#4ecdc4',
        data: pressureData,
        unit: 'kPa'
      }
    ],
    showBrush: true,
    showZoom: true,
    showAggregation: true
  },
};

export const SingleSeries: Story = {
  args: {
    title: 'Temperature Over Time',
    series: [
      {
        key: 'temperature',
        name: 'Temperature',
        color: '#ff6b6b',
        data: temperatureData,
        unit: '°C'
      }
    ],
    height: 300,
    showBrush: false
  },
};

export const MultipleSeries: Story = {
  args: {
    title: 'Environmental Monitoring',
    series: [
      {
        key: 'temperature',
        name: 'Temperature',
        color: '#ff6b6b',
        data: temperatureData,
        unit: '°C'
      },
      {
        key: 'pressure',
        name: 'Pressure', 
        color: '#4ecdc4',
        data: pressureData,
        unit: 'kPa'
      },
      {
        key: 'humidity',
        name: 'Humidity',
        color: '#45b7d1',
        data: humidityData,
        unit: '%'
      }
    ],
    height: 500,
    showBrush: true,
    autoUpdate: true
  },
};

export const WithGaps: Story = {
  args: {
    title: 'Data with Missing Points',
    series: [
      {
        key: 'temperature',
        name: 'Temperature',
        color: '#ff6b6b',
        data: temperatureData.filter((_, i) => Math.random() > 0.3), // Remove 30% of points
        unit: '°C'
      }
    ],
    showZoom: true
  },
};

export const EmptyState: Story = {
  args: {
    title: 'No Data Available',
    series: []
  },
};

export const Compact: Story = {
  args: {
    title: 'Compact Chart',
    series: [
      {
        key: 'value',
        name: 'Value',
        color: '#6c5ce7',
        data: generateMockData(20, 50, 10)
      }
    ],
    height: 200,
    showBrush: false,
    showZoom: false,
    showAggregation: false
  },
};

export const WithAggregation: Story = {
  args: {
    title: 'Aggregated Data View',
    series: [
      {
        key: 'temperature',
        name: 'Temperature (Avg)',
        color: '#ff6b6b',
        data: generateMockData(500, 22.5, 5),
        unit: '°C',
        aggregation: 'avg'
      },
      {
        key: 'pressure',
        name: 'Pressure (Max)',
        color: '#4ecdc4',
        data: generateMockData(500, 101.3, 3),
        unit: 'kPa',
        aggregation: 'max'
      }
    ],
    showAggregation: true
  },
};