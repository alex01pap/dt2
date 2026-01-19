// Campus layout data for isometric 2.5D view
// Positions are in grid units (1 unit = ~10 meters real scale)

export interface CampusBuilding {
  id: string;
  name: string;
  nameEn: string;
  position: { x: number; y: number }; // Grid position for CSS placement
  size: { width: number; depth: number; height: number }; // Building dimensions
  color: string; // Base color for the building
  accentColor: string; // Roof/accent color
  floors: number;
  rooms: CampusRoom[];
  description?: string;
  icon?: string; // Lucide icon name
}

export interface CampusRoom {
  id: string;
  name: string;
  floor: number;
  type: 'classroom' | 'lab' | 'office' | 'gym' | 'cafeteria' | 'music' | 'library' | 'other';
  sensorCount?: number;
}

// Prototype campus layout - will be replaced with actual school data
export const campusBuildings: CampusBuilding[] = [
  {
    id: 'building-a',
    name: 'Κτίριο Α',
    nameEn: 'Building A',
    position: { x: 2, y: 3 },
    size: { width: 4, depth: 3, height: 2 },
    color: '#3b82f6', // Blue
    accentColor: '#1d4ed8',
    floors: 2,
    description: 'Main teaching building with classrooms',
    rooms: [
      { id: 'a1-101', name: 'Τάξη Α1', floor: 1, type: 'classroom', sensorCount: 3 },
      { id: 'a1-102', name: 'Τάξη Α2', floor: 1, type: 'classroom', sensorCount: 2 },
      { id: 'a1-103', name: 'Τάξη Α3', floor: 1, type: 'classroom', sensorCount: 3 },
      { id: 'a2-201', name: 'Τάξη Α4', floor: 2, type: 'classroom', sensorCount: 2 },
      { id: 'a2-202', name: 'Τάξη Α5', floor: 2, type: 'classroom', sensorCount: 3 },
      { id: 'a2-203', name: 'Γραφείο Καθηγητών', floor: 2, type: 'office', sensorCount: 1 },
    ],
  },
  {
    id: 'building-b',
    name: 'Κτίριο Β',
    nameEn: 'Building B',
    position: { x: 7, y: 2 },
    size: { width: 3, depth: 4, height: 2 },
    color: '#10b981', // Emerald
    accentColor: '#059669',
    floors: 2,
    description: 'Secondary building with labs',
    rooms: [
      { id: 'b1-101', name: 'Εργαστήριο Φυσικής', floor: 1, type: 'lab', sensorCount: 5 },
      { id: 'b1-102', name: 'Εργαστήριο Χημείας', floor: 1, type: 'lab', sensorCount: 4 },
      { id: 'b2-201', name: 'Εργαστήριο Βιολογίας', floor: 2, type: 'lab', sensorCount: 4 },
      { id: 'b2-202', name: 'Βιβλιοθήκη', floor: 2, type: 'library', sensorCount: 2 },
    ],
  },
  {
    id: 'it-building',
    name: 'Πληροφορική',
    nameEn: 'IT Building',
    position: { x: 1, y: 7 },
    size: { width: 3, depth: 2, height: 1.5 },
    color: '#8b5cf6', // Violet
    accentColor: '#7c3aed',
    floors: 1,
    description: 'Computer labs and IT infrastructure',
    rooms: [
      { id: 'it-101', name: 'Αίθουσα Η/Υ 1', floor: 1, type: 'lab', sensorCount: 6 },
      { id: 'it-102', name: 'Αίθουσα Η/Υ 2', floor: 1, type: 'lab', sensorCount: 6 },
      { id: 'it-103', name: 'Server Room', floor: 1, type: 'other', sensorCount: 8 },
    ],
  },
  {
    id: 'gymnasium',
    name: 'Γυμναστήριο',
    nameEn: 'Gymnasium',
    position: { x: 5, y: 7 },
    size: { width: 4, depth: 3, height: 2.5 },
    color: '#f59e0b', // Amber
    accentColor: '#d97706',
    floors: 1,
    description: 'Sports hall and equipment storage',
    rooms: [
      { id: 'gym-main', name: 'Κύρια Αίθουσα', floor: 1, type: 'gym', sensorCount: 4 },
      { id: 'gym-storage', name: 'Αποθήκη', floor: 1, type: 'other', sensorCount: 1 },
      { id: 'gym-changing', name: 'Αποδυτήρια', floor: 1, type: 'other', sensorCount: 2 },
    ],
  },
  {
    id: 'cafeteria',
    name: 'Κυλικείο',
    nameEn: 'Cafeteria',
    position: { x: 10, y: 5 },
    size: { width: 2, depth: 2, height: 1 },
    color: '#ef4444', // Red
    accentColor: '#dc2626',
    floors: 1,
    description: 'Student cafeteria and dining area',
    rooms: [
      { id: 'cafe-main', name: 'Τραπεζαρία', floor: 1, type: 'cafeteria', sensorCount: 3 },
      { id: 'cafe-kitchen', name: 'Κουζίνα', floor: 1, type: 'other', sensorCount: 2 },
    ],
  },
  {
    id: 'music-room',
    name: 'Αίθουσα Μουσικής',
    nameEn: 'Music Room',
    position: { x: 10, y: 8 },
    size: { width: 2, depth: 2, height: 1.5 },
    color: '#ec4899', // Pink
    accentColor: '#db2777',
    floors: 1,
    description: 'Music classroom and practice rooms',
    rooms: [
      { id: 'music-main', name: 'Κύρια Αίθουσα', floor: 1, type: 'music', sensorCount: 2 },
      { id: 'music-storage', name: 'Αποθήκη Οργάνων', floor: 1, type: 'other', sensorCount: 1 },
    ],
  },
  {
    id: 'admin-building',
    name: 'Διοίκηση',
    nameEn: 'Administration',
    position: { x: 6, y: 0 },
    size: { width: 3, depth: 2, height: 1.5 },
    color: '#64748b', // Slate
    accentColor: '#475569',
    floors: 1,
    description: 'Administrative offices and reception',
    rooms: [
      { id: 'admin-reception', name: 'Γραμματεία', floor: 1, type: 'office', sensorCount: 2 },
      { id: 'admin-principal', name: 'Γραφείο Διευθυντή', floor: 1, type: 'office', sensorCount: 1 },
      { id: 'admin-teachers', name: 'Αίθουσα Καθηγητών', floor: 1, type: 'office', sensorCount: 2 },
    ],
  },
];

// Campus boundaries and features
export const campusConfig = {
  gridSize: { width: 14, height: 12 }, // Total grid size
  cellSize: 60, // Pixels per grid cell
  name: 'Πλάτων Σχολή',
  nameEn: 'Platon School',
};

// Calculate total sensors per building
export function getBuildingSensorCount(building: CampusBuilding): number {
  return building.rooms.reduce((total, room) => total + (room.sensorCount || 0), 0);
}

// Get total campus sensors
export function getTotalCampusSensors(): number {
  return campusBuildings.reduce((total, building) => total + getBuildingSensorCount(building), 0);
}
