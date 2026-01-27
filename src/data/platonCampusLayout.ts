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

// Building definitions - BOW AND ARROW CAMPUS LAYOUT
// Kindergarten (BOW) in NORTH → Elementary (ARROW) in CENTER → Lyceum (TARGET) in SOUTH
export const platonBuildings: CampusBuilding[] = [
  // ═══════════════════════════════════════════════════════════════
  // KINDERGARTEN - THE BOW (τόξο) - NORTH
  // C-shaped curve opening SOUTH, like an archer's bow
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'kindergarten-main',
    name: 'Νηπιαγωγείο',
    nameEn: 'Kindergarten (The Bow)',
    type: 'kindergarten',
    shape: 'horseshoe',
    position: [0, 0, -55], // NORTH position
    rotation: 180, // Opening faces SOUTH toward the arrow
    dimensions: {
      width: 32,
      depth: 24,
      height: 5,
      floors: 1,
    },
    colors: {
      walls: '#ffffff', // White walls
      roof: '#64748b', // Grey flat roof
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
      { id: 'k-3', name: 'Τάξη Γ', floor: 1, type: 'classroom', capacity: 20, sensors: [
        { type: 'temperature', value: 21.8, unit: '°C', status: 'warning' },
      ]},
      { id: 'k-office', name: 'Γραφείο', floor: 1, type: 'office', sensors: [
        { type: 'temperature', value: 22.0, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // Inner building in kindergarten courtyard (2-story BLUE building)
  {
    id: 'kindergarten-inner',
    name: 'Κεντρικό Νηπιαγωγείο',
    nameEn: 'Kindergarten Main Building',
    type: 'kindergarten',
    shape: 'rectangle',
    position: [0, 0, -48], // Inside the C-curve, slightly south
    rotation: 0,
    dimensions: {
      width: 14,
      depth: 10,
      height: 8,
      floors: 2,
    },
    colors: {
      walls: '#60a5fa', // Light blue - main classroom building
      roof: '#475569',
    },
    rooms: [
      { id: 'ki-1', name: 'Αίθουσα Παιχνιδιού', floor: 1, type: 'other', sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'ki-2', name: 'Διοίκηση', floor: 2, type: 'office', sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // ELEMENTARY SCHOOL - THE ARROW (βέλος) - CENTER
  // Chevron/Lambda (Λ) shape pointing SOUTH toward the target
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'elementary',
    name: 'Δημοτικό Σχολείο',
    nameEn: 'Elementary School (The Arrow)',
    type: 'elementary',
    shape: 'zigzag', // Will render as chevron via ChevronElementary component
    position: [0, 0, -10], // CENTER - between bow and target
    rotation: 0, // Point of chevron faces SOUTH
    dimensions: {
      width: 60, // Total wingspan of both wings
      depth: 20,
      height: 6,
      floors: 2,
    },
    colors: {
      walls: '#fef3c7', // Cream/white walls
      roof: '#4b5563', // Grey PITCHED roofs
      accent: '#7dd3fc', // Light blue accent stripe
    },
    rooms: [
      { id: 'e-1a', name: 'Α\' Τάξη - Τμήμα 1', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.3, unit: '°C', status: 'online' },
        { type: 'humidity', value: 44, unit: '%', status: 'online' },
        { type: 'occupancy', value: 22, unit: 'άτομα', status: 'online' },
      ]},
      { id: 'e-1b', name: 'Α\' Τάξη - Τμήμα 2', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.8, unit: '°C', status: 'online' },
      ]},
      { id: 'e-2a', name: 'Β\' Τάξη', floor: 1, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.1, unit: '°C', status: 'online' },
      ]},
      { id: 'e-3', name: 'Γ\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.4, unit: '°C', status: 'online' },
      ]},
      { id: 'e-4', name: 'Δ\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 23.0, unit: '°C', status: 'online' },
      ]},
      { id: 'e-5', name: 'Ε\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.7, unit: '°C', status: 'warning' },
      ]},
      { id: 'e-6', name: 'ΣΤ\' Τάξη', floor: 2, type: 'classroom', capacity: 25, sensors: [
        { type: 'temperature', value: 22.2, unit: '°C', status: 'online' },
      ]},
      { id: 'e-lab', name: 'Εργαστήριο Η/Υ', floor: 2, type: 'lab', sensors: [
        { type: 'temperature', value: 21.5, unit: '°C', status: 'online' },
      ]},
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // LYCEUM & GYMNASIUM - THE TARGET (στόχος) - SOUTH
  // C-shaped horseshoe opening NORTH to "catch" the arrow
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lyceum',
    name: 'Γυμνάσιο - Λύκειο',
    nameEn: 'Lyceum & Gymnasium (The Target)',
    type: 'lyceum',
    shape: 'ring',
    position: [0, 0, 50], // SOUTH position
    rotation: 0, // Opening faces NORTH toward the arrow
    dimensions: {
      width: 55,
      depth: 55,
      height: 11,
      floors: 3,
    },
    colors: {
      walls: '#fef3c7', // Ground floor: cream/beige
      roof: '#64748b', // Grey flat roof
      accent: '#7dd3fc', // Upper floors: light blue
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
  // ═══════════════════════════════════════════════════════════════
  // CHAPEL - WEST SIDE
  // Small rectangular building with RED pitched roof
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'chapel',
    name: 'Εκκλησάκι',
    nameEn: 'Chapel',
    type: 'chapel',
    shape: 'chapel',
    position: [-50, 0, 10], // WEST side
    rotation: 0,
    dimensions: {
      width: 8,
      depth: 12,
      height: 7,
      floors: 1,
    },
    colors: {
      walls: '#ffffff', // White walls
      roof: '#b91c1c', // RED terracotta roof
    },
    rooms: [
      { id: 'chapel-main', name: 'Κύρια Αίθουσα', floor: 1, type: 'other', sensors: [] },
    ],
  },
];

// Environmental elements - positioned for BOW AND ARROW layout
export const campusElements: CampusElement[] = [
  // Basketball court - between Elementary (arrow) and Kindergarten (bow)
  { id: 'basketball', type: 'basketball_court', position: [0, 0.1, -32], dimensions: [18, 0.1, 30] },
  
  // Solar panels - EAST side of campus
  { id: 'solar-1', type: 'solar_panels', position: [55, 2, -40], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-2', type: 'solar_panels', position: [55, 2, -30], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-3', type: 'solar_panels', position: [55, 2, -20], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-4', type: 'solar_panels', position: [55, 2, -10], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-5', type: 'solar_panels', position: [55, 2, 0], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-6', type: 'solar_panels', position: [55, 2, 10], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-7', type: 'solar_panels', position: [55, 2, 20], rotation: 15, dimensions: [25, 0.3, 6] },
  { id: 'solar-8', type: 'solar_panels', position: [55, 2, 30], rotation: 15, dimensions: [25, 0.3, 6] },
  
  // Parking lot - SOUTH of Lyceum (the target)
  { id: 'parking', type: 'parking', position: [0, 0.05, 95], dimensions: [60, 0.1, 30] },
  
  // School buses - WEST side along Elementary (the arrow)
  { id: 'bus-1', type: 'bus', position: [-38, 0, -25], rotation: 0 },
  { id: 'bus-2', type: 'bus', position: [-38, 0, -17], rotation: 0 },
  { id: 'bus-3', type: 'bus', position: [-38, 0, -9], rotation: 0 },
  { id: 'bus-4', type: 'bus', position: [-38, 0, -1], rotation: 0 },
  { id: 'bus-5', type: 'bus', position: [-38, 0, 7], rotation: 0 },
  { id: 'bus-6', type: 'bus', position: [-38, 0, 15], rotation: 0 },
  
  // Playground - near Kindergarten (the bow)
  { id: 'playground', type: 'field', position: [-25, 0, -55], dimensions: [15, 0.05, 15] },
  
  // Trees around perimeter
  // West perimeter
  { id: 'tree-1', type: 'tree', position: [-65, 0, -60] },
  { id: 'tree-2', type: 'tree', position: [-68, 0, -40] },
  { id: 'tree-3', type: 'tree', position: [-65, 0, -20] },
  { id: 'tree-4', type: 'tree', position: [-68, 0, 0] },
  { id: 'tree-5', type: 'tree', position: [-65, 0, 20] },
  { id: 'tree-6', type: 'tree', position: [-68, 0, 40] },
  { id: 'tree-7', type: 'tree', position: [-60, 0, 60] },
  // East perimeter (past solar panels)
  { id: 'tree-8', type: 'tree', position: [85, 0, -50] },
  { id: 'tree-9', type: 'tree', position: [88, 0, -25] },
  { id: 'tree-10', type: 'tree', position: [85, 0, 0] },
  { id: 'tree-11', type: 'tree', position: [88, 0, 25] },
  { id: 'tree-12', type: 'tree', position: [85, 0, 50] },
  // North perimeter (behind bow)
  { id: 'tree-13', type: 'tree', position: [-40, 0, -75] },
  { id: 'tree-14', type: 'tree', position: [-15, 0, -78] },
  { id: 'tree-15', type: 'tree', position: [15, 0, -78] },
  { id: 'tree-16', type: 'tree', position: [40, 0, -75] },
  // South perimeter (behind target/parking)
  { id: 'tree-17', type: 'tree', position: [-35, 0, 115] },
  { id: 'tree-18', type: 'tree', position: [0, 0, 118] },
  { id: 'tree-19', type: 'tree', position: [35, 0, 115] },
];

// Campus config - camera positioned for good view of Bow and Arrow layout
export const platonCampusConfig = {
  name: 'Εκπαιδευτήρια Πλάτων',
  nameEn: 'Platon Schools',
  groundSize: [220, 250],
  cameraPosition: [75, 60, 85] as [number, number, number], // Southeast looking northwest
  cameraTarget: [0, 0, 10] as [number, number, number],
};
