import { SensorData, HeatData, FlowPipeData } from '../components/twin/TwinViewer';

// Restaurant-specific sensor data
export const restaurantSensorData: SensorData[] = [
  // Kitchen Sensors
  {
    id: 'kitchen-temp-1',
    type: 'temperature',
    position: [-7, 1, -6],
    value: 32,
    unit: '°C',
    status: 'warning',
    name: 'Kitchen Stove Area'
  },
  {
    id: 'kitchen-temp-2',
    type: 'temperature',
    position: [-6.5, 1, -3],
    value: 24,
    unit: '°C',
    status: 'normal',
    name: 'Prep Area'
  },
  {
    id: 'freezer-temp',
    type: 'temperature',
    position: [-8.5, 1, -4],
    value: -18,
    unit: '°C',
    status: 'normal',
    name: 'Walk-in Freezer'
  },
  {
    id: 'fridge-temp',
    type: 'temperature',
    position: [-8.5, 1, -2],
    value: 4,
    unit: '°C',
    status: 'normal',
    name: 'Refrigeration Unit'
  },
  {
    id: 'kitchen-humidity',
    type: 'humidity',
    position: [-7, 1, -4],
    value: 68,
    unit: '%',
    status: 'warning',
    name: 'Kitchen Humidity'
  },
  {
    id: 'kitchen-air-quality',
    type: 'air_quality',
    position: [-7, 2, -6],
    value: 85,
    unit: 'AQI',
    status: 'normal',
    name: 'Kitchen Ventilation'
  },

  // Dining Area Sensors
  {
    id: 'dining-temp-1',
    type: 'temperature',
    position: [2, 1, -5],
    value: 22,
    unit: '°C',
    status: 'normal',
    name: 'Dining Area North'
  },
  {
    id: 'dining-temp-2',
    type: 'temperature',
    position: [6, 1, -3],
    value: 23,
    unit: '°C',
    status: 'normal',
    name: 'Dining Area Center'
  },
  {
    id: 'dining-temp-3',
    type: 'temperature',
    position: [2, 1, 4],
    value: 22.5,
    unit: '°C',
    status: 'normal',
    name: 'Dining Area South'
  },
  {
    id: 'dining-occupancy-1',
    type: 'occupancy',
    position: [4, 2, -2],
    value: 12,
    unit: 'people',
    status: 'normal',
    name: 'Current Occupancy'
  },
  {
    id: 'dining-humidity',
    type: 'humidity',
    position: [4, 1, 0],
    value: 45,
    unit: '%',
    status: 'normal',
    name: 'Dining Comfort'
  },
  {
    id: 'dining-air-quality',
    type: 'air_quality',
    position: [4, 2, 2],
    value: 95,
    unit: 'AQI',
    status: 'normal',
    name: 'Dining Air Quality'
  },

  // Service Area Sensors
  {
    id: 'service-temp',
    type: 'temperature',
    position: [-2, 1, 1],
    value: 24,
    unit: '°C',
    status: 'normal',
    name: 'Service Counter'
  },
  {
    id: 'beverage-temp',
    type: 'temperature',
    position: [-1.5, 1, 2],
    value: 8,
    unit: '°C',
    status: 'normal',
    name: 'Beverage Cooler'
  },

  // Equipment Monitoring
  {
    id: 'dishwasher-temp',
    type: 'temperature',
    position: [-8, 1, 0],
    value: 65,
    unit: '°C',
    status: 'normal',
    name: 'Dishwasher'
  },
  {
    id: 'exhaust-fan',
    type: 'airflow',
    position: [-7, 2.8, -6],
    value: 850,
    unit: 'CFM',
    status: 'normal',
    name: 'Kitchen Exhaust'
  }
];

// Restaurant heat map data (cooking areas, high-traffic zones)
export const restaurantHeatData: HeatData[] = [
  // Kitchen hot zones
  { position: [-7, 0.1, -6], intensity: 0.9, color: '#ff4444' }, // Stove area
  { position: [-6.5, 0.1, -6], intensity: 0.7, color: '#ff6644' },
  { position: [-7.5, 0.1, -6], intensity: 0.7, color: '#ff6644' },
  { position: [-6.5, 0.1, -3], intensity: 0.4, color: '#ffaa44' }, // Prep area
  { position: [-7.5, 0.1, -3], intensity: 0.4, color: '#ffaa44' },
  { position: [-8, 0.1, 0], intensity: 0.6, color: '#ff7744' }, // Dishwasher
  
  // High-traffic dining areas
  { position: [2, 0.1, -5], intensity: 0.3, color: '#44ff44' }, // Table 1
  { position: [6, 0.1, -3], intensity: 0.3, color: '#44ff44' }, // Table 2
  { position: [6, 0.1, 1], intensity: 0.3, color: '#44ff44' }, // Table 3
  { position: [2, 0.1, 4], intensity: 0.3, color: '#44ff44' }, // Table 4
  
  // Service counter
  { position: [-2, 0.1, 1], intensity: 0.5, color: '#4444ff' },
  
  // Cold zones (refrigeration)
  { position: [-8.5, 0.1, -4], intensity: 0.8, color: '#4444ff' }, // Freezer
  { position: [-8.5, 0.1, -2], intensity: 0.6, color: '#4466ff' }, // Fridge
];

// Restaurant flow pipes (ventilation, plumbing)
export const restaurantFlowData: FlowPipeData[] = [
  // Kitchen ventilation system
  {
    id: 'kitchen-exhaust-main',
    start: [-7, 2.5, -6],
    end: [-7, 2.5, -8],
    radius: 0.15,
    color: '#ff6b35',
    status: 'active',
    type: 'exhaust'
  },
  {
    id: 'kitchen-exhaust-branch-1',
    start: [-6, 2.5, -6],
    end: [-7, 2.5, -6],
    radius: 0.1,
    color: '#ff6b35',
    status: 'active',
    type: 'exhaust'
  },
  {
    id: 'kitchen-exhaust-branch-2',
    start: [-8, 2.5, -6],
    end: [-7, 2.5, -6],
    radius: 0.1,
    color: '#ff6b35',
    status: 'active',
    type: 'exhaust'
  },
  
  // Fresh air intake
  {
    id: 'fresh-air-main',
    start: [4, 2.5, -8],
    end: [4, 2.5, 4],
    radius: 0.12,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
  {
    id: 'fresh-air-dining-1',
    start: [4, 2.5, -2],
    end: [2, 2.5, -2],
    radius: 0.08,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
  {
    id: 'fresh-air-dining-2',
    start: [4, 2.5, 2],
    end: [6, 2.5, 2],
    radius: 0.08,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
  
  // Water supply lines
  {
    id: 'water-main',
    start: [-10, 0.5, -8],
    end: [-8, 0.5, -8],
    radius: 0.05,
    color: '#3498db',
    status: 'active',
    type: 'water'
  },
  {
    id: 'water-kitchen',
    start: [-8, 0.5, -8],
    end: [-8, 0.5, 0],
    radius: 0.05,
    color: '#3498db',
    status: 'active',
    type: 'water'
  },
  {
    id: 'water-dishwasher',
    start: [-8, 0.5, -1],
    end: [-8, 0.5, 0],
    radius: 0.03,
    color: '#3498db',
    status: 'active',
    type: 'water'
  },
  
  // Gas lines for cooking equipment
  {
    id: 'gas-main',
    start: [-10, 0.3, -7],
    end: [-7, 0.3, -7],
    radius: 0.04,
    color: '#f39c12',
    status: 'active',
    type: 'gas'
  },
  {
    id: 'gas-stove',
    start: [-7, 0.3, -7],
    end: [-7, 0.3, -6],
    radius: 0.03,
    color: '#f39c12',
    status: 'active',
    type: 'gas'
  },
];

// Restaurant-specific KPI data
export const restaurantKPIs = [
  { 
    title: "Current Occupancy", 
    value: "12/32", 
    change: "+3 from last hour",
    trend: "up" as const,
    percentage: 37.5
  },
  { 
    title: "Kitchen Efficiency", 
    value: "94%", 
    change: "+2% from yesterday",
    trend: "up" as const,
    percentage: 94
  },
  { 
    title: "Energy Usage", 
    value: "847 kWh", 
    change: "-5% from average",
    trend: "down" as const,
    percentage: 75
  },
  { 
    title: "Food Safety Score", 
    value: "98.5", 
    change: "Excellent",
    trend: "up" as const,
    percentage: 98.5
  }
];

// Restaurant events
export const restaurantEvents = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'alert' as const,
    message: 'Kitchen temperature spike detected in stove area',
    severity: 'warning' as const,
    sensor: 'kitchen-temp-1'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    type: 'info' as const,
    message: 'Peak dining hours: 45% capacity reached',
    severity: 'info' as const,
    sensor: 'dining-occupancy-1'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 47 * 60 * 1000),
    type: 'maintenance' as const,
    message: 'Dishwasher cycle completed successfully',
    severity: 'info' as const,
    sensor: 'dishwasher-temp'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
    type: 'alert' as const,
    message: 'Kitchen humidity levels elevated',
    severity: 'warning' as const,
    sensor: 'kitchen-humidity'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 89 * 60 * 1000),
    type: 'info' as const,
    message: 'Fresh air intake system optimized',
    severity: 'info' as const,
    sensor: 'exhaust-fan'
  }
];