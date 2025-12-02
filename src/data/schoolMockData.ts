import { SensorData, HeatData, FlowPipeData } from '../components/twin/TwinViewer';

// School classroom sensor data
export const classroomSensorData: SensorData[] = [
  // Sound/Noise Level Sensors
  {
    id: 'classroom-sound-1',
    type: 'sound',
    position: [0, 2.5, 0],
    value: 45,
    unit: 'dB',
    status: 'normal',
    name: 'Center Noise Level'
  },
  {
    id: 'classroom-sound-2',
    type: 'sound',
    position: [-3, 2.5, -3],
    value: 38,
    unit: 'dB',
    status: 'normal',
    name: 'Teacher Area'
  },
  {
    id: 'classroom-sound-3',
    type: 'sound',
    position: [3, 2.5, 2],
    value: 62,
    unit: 'dB',
    status: 'warning',
    name: 'Back Corner'
  },
  
  // Temperature Sensors
  {
    id: 'classroom-temp-1',
    type: 'temperature',
    position: [-5.5, 2, 0],
    value: 22,
    unit: '°C',
    status: 'normal',
    name: 'AC Temperature'
  },
  {
    id: 'classroom-temp-2',
    type: 'temperature',
    position: [5, 1.5, 0],
    value: 24,
    unit: '°C',
    status: 'normal',
    name: 'Window Area'
  },

  // Air Quality
  {
    id: 'classroom-co2',
    type: 'air_quality',
    position: [0, 2.8, -4],
    value: 650,
    unit: 'ppm',
    status: 'normal',
    name: 'CO₂ Level'
  },

  // Occupancy
  {
    id: 'classroom-occupancy',
    type: 'occupancy',
    position: [4, 2.5, 4.5],
    value: 18,
    unit: 'students',
    status: 'normal',
    name: 'Room Occupancy'
  },

  // Light Level
  {
    id: 'classroom-light',
    type: 'light',
    position: [0, 0.8, 0],
    value: 450,
    unit: 'lux',
    status: 'normal',
    name: 'Desk Light Level'
  }
];

// Heat map data for classroom (noise intensity visualization)
export const classroomHeatData: HeatData[] = [
  // Higher noise areas (typically where students sit)
  { position: [-2, 0.1, 0.5], intensity: 0.4, color: '#ffd700' },
  { position: [1, 0.1, 0.5], intensity: 0.5, color: '#ffa500' },
  { position: [4, 0.1, 0.5], intensity: 0.3, color: '#90ee90' },
  
  { position: [-2, 0.1, 2.3], intensity: 0.5, color: '#ffa500' },
  { position: [1, 0.1, 2.3], intensity: 0.6, color: '#ff6347' },
  { position: [4, 0.1, 2.3], intensity: 0.7, color: '#ff4500' },
  
  { position: [-2, 0.1, 4.1], intensity: 0.6, color: '#ff6347' },
  { position: [1, 0.1, 4.1], intensity: 0.7, color: '#ff4500' },
  { position: [4, 0.1, 4.1], intensity: 0.5, color: '#ffa500' },
  
  // Teacher area (quieter)
  { position: [-3, 0.1, -3.5], intensity: 0.2, color: '#90ee90' },
  
  // Near door (variable)
  { position: [4, 0.1, 4.5], intensity: 0.4, color: '#ffd700' },
];

// Flow pipes (HVAC system)
export const classroomFlowData: FlowPipeData[] = [
  // AC air flow from unit to room
  {
    id: 'ac-supply',
    start: [-5.8, 2.6, 0],
    end: [-4, 2.6, 0],
    radius: 0.08,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
  {
    id: 'ac-distribution-1',
    start: [-4, 2.6, 0],
    end: [0, 2.6, 0],
    radius: 0.06,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
  {
    id: 'ac-distribution-2',
    start: [0, 2.6, 0],
    end: [4, 2.6, 0],
    radius: 0.06,
    color: '#4ecdc4',
    status: 'active',
    type: 'supply'
  },
];

// School-specific KPIs
export const classroomKPIs = [
  { 
    title: "Noise Level", 
    value: "45 dB", 
    change: "Optimal for learning",
    trend: "stable" as const,
    percentage: 45
  },
  { 
    title: "Air Quality", 
    value: "650 ppm", 
    change: "Good CO₂ levels",
    trend: "stable" as const,
    percentage: 35
  },
  { 
    title: "Temperature", 
    value: "22°C", 
    change: "Comfortable",
    trend: "stable" as const,
    percentage: 22
  },
  { 
    title: "Occupancy", 
    value: "18/25", 
    change: "72% capacity",
    trend: "up" as const,
    percentage: 72
  }
];

// Classroom events
export const classroomEvents = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'info' as const,
    message: 'Noise level increased during group activity',
    severity: 'info' as const,
    sensor: 'classroom-sound-3'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'info' as const,
    message: 'Class session started - 18 students detected',
    severity: 'info' as const,
    sensor: 'classroom-occupancy'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'maintenance' as const,
    message: 'AC system optimized for current occupancy',
    severity: 'info' as const,
    sensor: 'classroom-temp-1'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    type: 'alert' as const,
    message: 'CO₂ levels approaching threshold - ventilation increased',
    severity: 'warning' as const,
    sensor: 'classroom-co2'
  }
];
