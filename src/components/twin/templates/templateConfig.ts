import { 
  School, 
  Monitor, 
  UtensilsCrossed, 
  Trophy, 
  Trees, 
  Dumbbell,
  type LucideIcon 
} from 'lucide-react';

export type RoomSize = 'small' | 'medium' | 'large';
export type RoomCategory = 'classroom' | 'specialized' | 'sport' | 'service' | 'outdoor';

export interface SizeConfig {
  capacity: number;
  dimensions: [number, number, number]; // [width, depth, height]
  label: string;
  description: string;
}

export interface RoomTemplate {
  id: string;
  name: string;
  nameGr: string;
  icon: LucideIcon;
  category: RoomCategory;
  description: string;
  sizes: Record<RoomSize, SizeConfig>;
  defaultSize: RoomSize;
  features: string[];
  previewColor: string;
}

export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    id: 'classroom',
    name: 'Classroom',
    nameGr: 'Αίθουσα Διδασκαλίας',
    icon: School,
    category: 'classroom',
    description: 'Standard classroom with desks and whiteboard',
    sizes: {
      small: { 
        capacity: 15, 
        dimensions: [8, 6, 3.2], 
        label: 'Small',
        description: '15 students • 8m × 6m'
      },
      medium: { 
        capacity: 25, 
        dimensions: [12, 10, 3.2], 
        label: 'Medium',
        description: '25 students • 12m × 10m'
      },
      large: { 
        capacity: 35, 
        dimensions: [16, 12, 3.5], 
        label: 'Large',
        description: '35 students • 16m × 12m'
      },
    },
    defaultSize: 'medium',
    features: ['whiteboard', 'projector', 'ac', 'windows'],
    previewColor: '#3b82f6',
  },
  {
    id: 'it-classroom',
    name: 'IT Classroom',
    nameGr: 'Αίθουσα Πληροφορικής',
    icon: Monitor,
    category: 'specialized',
    description: 'Computer lab with workstations',
    sizes: {
      small: { 
        capacity: 12, 
        dimensions: [10, 8, 3.2], 
        label: 'Small',
        description: '12 students • 10m × 8m'
      },
      medium: { 
        capacity: 20, 
        dimensions: [14, 10, 3.2], 
        label: 'Medium',
        description: '20 students • 14m × 10m'
      },
      large: { 
        capacity: 30, 
        dimensions: [18, 12, 3.5], 
        label: 'Large',
        description: '30 students • 18m × 12m'
      },
    },
    defaultSize: 'medium',
    features: ['computers', 'projector', 'server_rack', 'ac'],
    previewColor: '#8b5cf6',
  },
  {
    id: 'restaurant',
    name: 'Restaurant / Cafeteria',
    nameGr: 'Εστιατόριο / Καφετέρια',
    icon: UtensilsCrossed,
    category: 'service',
    description: 'Dining area with tables and kitchen',
    sizes: {
      small: { 
        capacity: 30, 
        dimensions: [12, 10, 3.5], 
        label: 'Small',
        description: '30 seats • 12m × 10m'
      },
      medium: { 
        capacity: 60, 
        dimensions: [18, 14, 4], 
        label: 'Medium',
        description: '60 seats • 18m × 14m'
      },
      large: { 
        capacity: 100, 
        dimensions: [25, 18, 4.5], 
        label: 'Large',
        description: '100 seats • 25m × 18m'
      },
    },
    defaultSize: 'medium',
    features: ['kitchen', 'serving_area', 'tables', 'ac'],
    previewColor: '#f59e0b',
  },
  {
    id: 'soccer-field',
    name: 'Soccer Field',
    nameGr: 'Γήπεδο Ποδοσφαίρου',
    icon: Trophy,
    category: 'sport',
    description: 'Outdoor soccer/football field',
    sizes: {
      small: { 
        capacity: 10, 
        dimensions: [25, 15, 0], 
        label: '5v5',
        description: '5v5 • 25m × 15m'
      },
      medium: { 
        capacity: 14, 
        dimensions: [50, 30, 0], 
        label: '7v7',
        description: '7v7 • 50m × 30m'
      },
      large: { 
        capacity: 22, 
        dimensions: [90, 60, 0], 
        label: '11v11',
        description: '11v11 • 90m × 60m'
      },
    },
    defaultSize: 'medium',
    features: ['goals', 'benches', 'scoreboard', 'lights'],
    previewColor: '#22c55e',
  },
  {
    id: 'outdoor-area',
    name: 'Outdoor Area',
    nameGr: 'Εξωτερικός Χώρος',
    icon: Trees,
    category: 'outdoor',
    description: 'Courtyard, playground or garden area',
    sizes: {
      small: { 
        capacity: 20, 
        dimensions: [15, 12, 0], 
        label: 'Small',
        description: '20 people • 15m × 12m'
      },
      medium: { 
        capacity: 50, 
        dimensions: [25, 20, 0], 
        label: 'Medium',
        description: '50 people • 25m × 20m'
      },
      large: { 
        capacity: 100, 
        dimensions: [40, 30, 0], 
        label: 'Large',
        description: '100 people • 40m × 30m'
      },
    },
    defaultSize: 'medium',
    features: ['trees', 'benches', 'paths', 'playground'],
    previewColor: '#10b981',
  },
  {
    id: 'gymnasium',
    name: 'Gymnasium',
    nameGr: 'Γυμναστήριο',
    icon: Dumbbell,
    category: 'sport',
    description: 'Indoor sports hall',
    sizes: {
      small: { 
        capacity: 30, 
        dimensions: [20, 15, 6], 
        label: 'Small',
        description: '30 people • 20m × 15m'
      },
      medium: { 
        capacity: 60, 
        dimensions: [30, 20, 8], 
        label: 'Medium',
        description: '60 people • 30m × 20m'
      },
      large: { 
        capacity: 100, 
        dimensions: [45, 30, 10], 
        label: 'Large',
        description: '100 people • 45m × 30m'
      },
    },
    defaultSize: 'medium',
    features: ['basketball', 'volleyball', 'bleachers', 'scoreboard'],
    previewColor: '#ef4444',
  },
];

export const getTemplateById = (id: string): RoomTemplate | undefined => {
  return ROOM_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: RoomCategory): RoomTemplate[] => {
  return ROOM_TEMPLATES.filter(t => t.category === category);
};
