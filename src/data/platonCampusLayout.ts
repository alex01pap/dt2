// Platon Schools Campus Layout - "Εκπαιδευτήρια Πλάτων"
// Accurate 3D positions based on satellite imagery

export interface CampusBuilding {
  id: string;
  name: string;
  nameEn: string;
  type: 'kindergarten' | 'elementary' | 'lyceum' | 'utility' | 'chapel';
  shape: 'horseshoe' | 'zigzag' | 'ring' | 'rectangle' | 'chapel';
  position: [number, number, number]; // x, y, z
  rotation: number; // degrees
  dimensions: {
    width: number;
    depth: number;
    height: number;
    floors: number;
  };
  colors: {
    walls: string;
    roof: string;
    accent?: string;
  };
  rooms: CampusRoom[];
}

export interface CampusRoom {
  id: string;
  name: string;
  floor: number;
  type: 'classroom' | 'lab' | 'office' | 'gym' | 'cafeteria' | 'music' | 'library' | 'restroom' | 'storage' | 'other';
  capacity?: number;
  sensors: RoomSensor[];
}

export interface RoomSensor {
  type: 'temperature' | 'humidity' | 'occupancy' | 'air_quality' | 'light';
  value: number;
  unit: string;
  status: 'online' | 'warning' | 'offline';
}

export interface CampusElement {
  id: string;
  type: 'basketball_court' | 'solar_panels' | 'parking' | 'bus' | 'tree' | 'field';
  position: [number, number, number];
  rotation?: number;
  dimensions?: [number, number, number];
}

// Building definitions
export const platonBuildings: CampusBuilding[] = [
  // Kindergarten - C-shaped building (north) - smaller curved building matching photos
  {
    id: 'kindergarten-main',
    name: 'Νηπιαγωγείο',
    nameEn: 'Kindergarten',
    type: 'kindergarten',
    shape: 'horseshoe',
    position: [0, 0, -50],
    rotation: 0,
    dimensions: {
      width: 28,
      depth: 20,
      height: 6,
      floors: 2,
    },
    colors: {
      walls: '#ffffff',
      roof: '#64748b',
      accent: '#7dd3fc',
    },
    rooms: [
      { id: 'k-1', name: 'Τάξη Α', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
        { type: 'humidity', value: 45, unit: '%', status: 'online' },
        { type: 'occupancy', value: 18, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'k-2', name: 'Τάξη Β', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 23.1, unit: '°C', status: 'online' },
        { type: 'humidity', value: 48, unit: '%', status: 'online' },
        { type: 'occupancy', value: 15, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'k-3', name: 'Τάξη Γ', floor: 2, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 21.8, unit: '°C', status: 'warning' },
        { type: 'humidity', value: 52, unit: '%', status: 'online' },
        { type: 'occupancy', value: 19, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'k-4', name: 'Τάξη Δ', floor: 2, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
      ]},
      { id: 'k-office', name: 'Γραφείο', floor: 1, type: 'office', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // Inner building in kindergarten curve (2-story blue building)
  {
    id: 'kindergarten-inner',
    name: 'Κτίριο Νηπιαγωγείου Β',
    nameEn: 'Kindergarten B',
    type: 'kindergarten',
    shape: 'rectangle',
    position: [0, 0, -40],
    rotation: 0,
    dimensions: {
      width: 12,
      depth: 10,
      height: 7,
      floors: 2,
    },
    colors: {
      walls: '#93c5fd',
      roof: '#4a5568',
    },
    rooms: [
      { id: 'ki-1', name: 'Αίθουσα Παιχνιδιού', floor: 1, type: 'other', sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'ki-2', name: 'Αίθουσα Ύπνου', floor: 2, type: 'other', sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // Elementary School - Zigzag/W-shaped building (center)
  {
    id: 'elementary',
    name: 'Δημοτικό Σχολείο',
    nameEn: 'Elementary School',
    type: 'elementary',
    shape: 'zigzag',
    position: [0, 0, 0],
    rotation: -15,
    dimensions: {
      width: 60,
      depth: 20,
      height: 5,
      floors: 1,
    },
    colors: {
      walls: '#fef3c7',
      roof: '#4a5568',
      accent: '#3b82f6',
    },
    rooms: [
      { id: 'e-1a', name: 'Α\' Τάξη - Τμήμα 1', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.3, unit: '°C', status: 'online' },
        { type: 'humidity', value: 44, unit: '%', status: 'online' },
        { type: 'occupancy', value: 22, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'e-1b', name: 'Α\' Τάξη - Τμήμα 2', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
        { type: 'humidity', value: 46, unit: '%', status: 'online' },
        { type: 'occupancy', value: 24, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'e-2a', name: 'Β\' Τάξη - Τμήμα 1', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.1, unit: '°C', status: 'online' },
        { type: 'humidity', value: 42, unit: '%', status: 'online' },
        { type: 'occupancy', value: 20, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'e-2b', name: 'Β\' Τάξη - Τμήμα 2', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.6, unit: '°C', status: 'offline' },
        { type: 'humidity', value: 45, unit: '%', status: 'offline' },
      ]},
      { id: 'e-3', name: 'Γ\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.4, unit: '°C', status: 'online' },
      ]},
      { id: 'e-4', name: 'Δ\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'e-5', name: 'Ε\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.7, unit: '°C', status: 'warning' },
      ]},
      { id: 'e-6', name: 'ΣΤ\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.2, unit: '°C', status: 'online' },
      ]},
      { id: 'e-lab', name: 'Εργαστήριο Η/Υ', floor: 1, type: 'lab', sensors: [
        { type: 'temperature', value: 21.5, unit: '°C', status: 'online' },
        { type: 'humidity', value: 40, unit: '%', status: 'online' },
      ]},
      { id: 'e-music', name: 'Αίθουσα Μουσικής', floor: 1, type: 'music', sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // Lyceum & Gymnasium - C-shaped building (south) - large curved building matching photos
  {
    id: 'lyceum',
    name: 'Γυμνάσιο - Λύκειο',
    nameEn: 'Lyceum & Gymnasium',
    type: 'lyceum',
    shape: 'ring',
    position: [0, 0, 50],
    rotation: 0,
    dimensions: {
      width: 50,
      depth: 50,
      height: 11,
      floors: 3,
    },
    colors: {
      walls: '#fef3c7',
      roof: '#64748b',
      accent: '#7dd3fc',
    },
    rooms: [
      // Ground floor
      { id: 'l-reception', name: 'Υποδοχή', floor: 1, type: 'office', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
        { type: 'occupancy', value: 3, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'l-cafeteria', name: 'Κυλικείο', floor: 1, type: 'cafeteria', sensors: [
        { type: 'temperature', value: 23.5, unit: '°C', status: 'online' },
        { type: 'humidity', value: 55, unit: '%', status: 'warning' },
      ]},
      { id: 'l-gym', name: 'Γυμναστήριο', floor: 1, type: 'gym', sensors: [
        { type: 'temperature', value: 24.0, unit: '°C', status: 'online' },
        { type: 'humidity', value: 60, unit: '%', status: 'online' },
      ]},
      // First floor
      { id: 'l-1a', name: 'Α\' Γυμνασίου', floor: 2, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
        { type: 'humidity', value: 45, unit: '%', status: 'online' },
        { type: 'occupancy', value: 28, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'l-2a', name: 'Β\' Γυμνασίου', floor: 2, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
        { type: 'occupancy', value: 25, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'l-3a', name: 'Γ\' Γυμνασίου', floor: 2, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'l-physics', name: 'Εργαστήριο Φυσικής', floor: 2, type: 'lab', sensors: [
        { type: 'temperature', value: 21.8, unit: '°C', status: 'online' },
        { type: 'air_quality', value: 95, unit: 'AQI', status: 'online' },
      ]},
      // Second floor
      { id: 'l-1b', name: 'Α\' Λυκείου', floor: 3, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.6, unit: '°C', status: 'online' },
        { type: 'humidity', value: 44, unit: '%', status: 'online' },
      ]},
      { id: 'l-2b', name: 'Β\' Λυκείου', floor: 3, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 22.4, unit: '°C', status: 'warning' },
      ]},
      { id: 'l-3b', name: 'Γ\' Λυκείου', floor: 3, type: 'classroom', capacity: 30, sensors: [
        { type: 'temperature', value: 23.2, unit: '°C', status: 'online' },
      ]},
      { id: 'l-chemistry', name: 'Εργαστήριο Χημείας', floor: 3, type: 'lab', sensors: [
        { type: 'temperature', value: 21.5, unit: '°C', status: 'online' },
        { type: 'air_quality', value: 88, unit: 'AQI', status: 'online' },
      ]},
      { id: 'l-library', name: 'Βιβλιοθήκη', floor: 3, type: 'library', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
        { type: 'humidity', value: 42, unit: '%', status: 'online' },
      ]},
    ],
  },
  // Chapel (west)
  {
    id: 'chapel',
    name: 'Εκκλησάκι',
    nameEn: 'Chapel',
    type: 'chapel',
    shape: 'chapel',
    position: [-40, 0, 20],
    rotation: 0,
    dimensions: {
      width: 8,
      depth: 12,
      height: 8,
      floors: 1,
    },
    colors: {
      walls: '#ffffff',
      roof: '#b91c1c',
    },
    rooms: [
      { id: 'chapel-main', name: 'Κύρια Αίθουσα', floor: 1, type: 'other', sensors: [] },
    ],
  },
];

// Environmental elements
export const campusElements: CampusElement[] = [
  // Basketball court between elementary and kindergarten
  { id: 'basketball', type: 'basketball_court', position: [-25, 0.1, -20], dimensions: [15, 0.1, 28] },
  
  // Solar panels to the east
  { id: 'solar-1', type: 'solar_panels', position: [50, 2, -30], rotation: 15, dimensions: [30, 0.3, 8] },
  { id: 'solar-2', type: 'solar_panels', position: [50, 2, -20], rotation: 15, dimensions: [30, 0.3, 8] },
  { id: 'solar-3', type: 'solar_panels', position: [50, 2, -10], rotation: 15, dimensions: [30, 0.3, 8] },
  { id: 'solar-4', type: 'solar_panels', position: [50, 2, 0], rotation: 15, dimensions: [30, 0.3, 8] },
  { id: 'solar-5', type: 'solar_panels', position: [50, 2, 10], rotation: 15, dimensions: [30, 0.3, 8] },
  { id: 'solar-6', type: 'solar_panels', position: [50, 2, 20], rotation: 15, dimensions: [30, 0.3, 8] },
  
  // Parking lot south of lyceum
  { id: 'parking', type: 'parking', position: [0, 0.05, 90], dimensions: [50, 0.1, 25] },
  
  // School buses along elementary
  { id: 'bus-1', type: 'bus', position: [-35, 0, -5], rotation: -15 },
  { id: 'bus-2', type: 'bus', position: [-35, 0, 2], rotation: -15 },
  { id: 'bus-3', type: 'bus', position: [-35, 0, 9], rotation: -15 },
  { id: 'bus-4', type: 'bus', position: [-35, 0, 16], rotation: -15 },
  { id: 'bus-5', type: 'bus', position: [-35, 0, 23], rotation: -15 },
  
  // Central field
  { id: 'field', type: 'field', position: [15, 0, -15], dimensions: [25, 0.05, 25] },
  
  // Olive trees around perimeter
  { id: 'tree-1', type: 'tree', position: [-55, 0, -50] },
  { id: 'tree-2', type: 'tree', position: [-50, 0, -55] },
  { id: 'tree-3', type: 'tree', position: [-45, 0, -58] },
  { id: 'tree-4', type: 'tree', position: [-60, 0, -30] },
  { id: 'tree-5', type: 'tree', position: [-58, 0, -10] },
  { id: 'tree-6', type: 'tree', position: [-60, 0, 10] },
  { id: 'tree-7', type: 'tree', position: [-55, 0, 30] },
  { id: 'tree-8', type: 'tree', position: [-50, 0, 50] },
  { id: 'tree-9', type: 'tree', position: [55, 0, -50] },
  { id: 'tree-10', type: 'tree', position: [60, 0, -30] },
  { id: 'tree-11', type: 'tree', position: [65, 0, 30] },
  { id: 'tree-12', type: 'tree', position: [60, 0, 50] },
  { id: 'tree-13', type: 'tree', position: [40, 0, 100] },
  { id: 'tree-14', type: 'tree', position: [-40, 0, 100] },
  { id: 'tree-15', type: 'tree', position: [0, 0, 105] },
];

// Campus config
export const platonCampusConfig = {
  name: 'Εκπαιδευτήρια Πλάτων',
  nameEn: 'Platon Schools',
  groundSize: [200, 220],
  cameraPosition: [80, 80, 80] as [number, number, number],
  cameraTarget: [0, 0, 20] as [number, number, number],
};
