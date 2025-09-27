import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioRunner } from './ScenarioRunner';

const meta: Meta<typeof ScenarioRunner> = {
  title: 'Simulation/ScenarioRunner',
  component: ScenarioRunner,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onScenarioSave: { action: 'scenarioSaved' },
    onResultsExport: { action: 'resultsExported' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScenario = {
  id: 'scenario-1',
  name: 'HVAC System Test',
  description: 'Test HVAC system response to temperature changes',
  duration: 300,
  inputs: [
    {
      id: 'temp_range',
      name: 'Temperature Range (°C)',
      type: 'range' as const,
      value: [18, 28],
      min: 0,
      max: 50,
      required: true
    },
    {
      id: 'humidity',
      name: 'Humidity Level (%)',
      type: 'number' as const,
      value: 45,
      min: 0,
      max: 100,
      required: true
    },
    {
      id: 'system_mode',
      name: 'System Mode',
      type: 'selection' as const,
      value: 'auto',
      options: ['auto', 'heating', 'cooling', 'off'],
      required: true
    },
    {
      id: 'enable_alerts',
      name: 'Enable Alerts',
      type: 'boolean' as const,
      value: true,
      required: false
    },
    {
      id: 'test_note',
      name: 'Test Notes',
      type: 'text' as const,
      value: 'Baseline test scenario',
      required: false
    }
  ]
};

export const Default: Story = {
  args: {},
};

export const WithConfiguration: Story = {
  args: {
    scenario: sampleScenario
  },
};

export const ComplexScenario: Story = {
  args: {
    scenario: {
      id: 'scenario-2',
      name: 'Multi-System Integration Test',
      description: 'Comprehensive test of building automation systems including HVAC, lighting, and security',
      duration: 900, // 15 minutes
      inputs: [
        {
          id: 'occupancy',
          name: 'Building Occupancy',
          type: 'number',
          value: 150,
          min: 0,
          max: 500,
          required: true
        },
        {
          id: 'temp_setpoint',
          name: 'Temperature Setpoint (°C)',
          type: 'number',
          value: 22,
          min: 15,
          max: 30,
          required: true
        },
        {
          id: 'lighting_schedule',
          name: 'Lighting Schedule',
          type: 'selection',
          value: 'business_hours',
          options: ['24x7', 'business_hours', 'custom', 'off'],
          required: true
        },
        {
          id: 'security_level',
          name: 'Security Level',
          type: 'selection',
          value: 'normal',
          options: ['low', 'normal', 'high', 'maximum'],
          required: true
        },
        {
          id: 'energy_mode',
          name: 'Energy Efficiency Mode',
          type: 'boolean',
          value: false,
          required: false
        },
        {
          id: 'weather_temp',
          name: 'Outside Temperature Range (°C)',
          type: 'range',
          value: [10, 25],
          min: -20,
          max: 45,
          required: true
        },
        {
          id: 'wind_speed',
          name: 'Wind Speed (km/h)',
          type: 'number',
          value: 15,
          min: 0,
          max: 100,
          required: false
        },
        {
          id: 'simulation_notes',
          name: 'Simulation Notes',
          type: 'text',
          value: 'Testing system integration under normal operating conditions',
          required: false
        }
      ]
    }
  },
};

export const MinimalScenario: Story = {
  args: {
    scenario: {
      id: 'scenario-3',
      name: 'Simple Sensor Test',
      description: 'Basic sensor reading validation',
      duration: 60,
      inputs: [
        {
          id: 'sensor_id',
          name: 'Sensor ID',
          type: 'text',
          value: 'temp-001',
          required: true
        },
        {
          id: 'reading_interval',
          name: 'Reading Interval (seconds)',
          type: 'number',
          value: 5,
          min: 1,
          max: 60,
          required: true
        }
      ]
    }
  },
};

export const EmptyScenario: Story = {
  args: {
    scenario: {
      name: 'New Test Scenario',
      description: '',
      duration: 300,
      inputs: []
    }
  },
};

export const LongRunningScenario: Story = {
  args: {
    scenario: {
      id: 'scenario-4',
      name: '24-Hour System Stress Test',
      description: 'Extended duration test to evaluate system performance over a full day cycle',
      duration: 86400, // 24 hours
      inputs: [
        {
          id: 'load_profile',
          name: 'Load Profile',
          type: 'selection',
          value: 'realistic',
          options: ['minimal', 'realistic', 'stress', 'maximum'],
          required: true
        },
        {
          id: 'failure_simulation',
          name: 'Include Failure Scenarios',
          type: 'boolean',
          value: true,
          required: false
        },
        {
          id: 'data_collection_rate',
          name: 'Data Collection Rate (per minute)',
          type: 'number',
          value: 12,
          min: 1,
          max: 60,
          required: true
        }
      ]
    }
  },
};