export interface Room {
    id: string;
    name: string;
    floor: number;
    hasSensors: boolean;
    sensorStatus: 'online' | 'warning' | 'offline';
    temperature?: number;
    humidity?: number;
    occupancy?: number;
}

export interface Building {
    id: string;
    nameGr: string;
    nameEn: string;
    sqMeters: number;
    floors: number;
    totalRooms: number;
    roomsWithSensors: number;
    currentConsumption: number;
    avgTemperature: number;
    avgHumidity: number;
    occupancyPercent: number;
    rooms: Room[];
}

export const buildingsData: Building[] = [
    {
        id: 'kindergarten',
        nameGr: 'Νηπιαγωγείο',
        nameEn: 'Kindergarten',
        sqMeters: 850,
        floors: 2,
        totalRooms: 8,
        roomsWithSensors: 6,
        currentConsumption: 28.5,
        avgTemperature: 22.1,
        avgHumidity: 45,
        occupancyPercent: 82,
        rooms: [
            { id: 'k1', name: 'Αίθουσα Προνηπίων', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 44 },
            { id: 'k2', name: 'Αίθουσα Νηπίων Α', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 46 },
            { id: 'k3', name: 'Αίθουσα Νηπίων Β', floor: 1, hasSensors: true, sensorStatus: 'warning', temperature: 24, humidity: 52 },
            { id: 'k4', name: 'Αίθουσα Μουσικής', floor: 2, hasSensors: false, sensorStatus: 'offline' },
            { id: 'k5', name: 'Αίθουσα Δραστηριοτήτων', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 23, humidity: 47 },
            { id: 'k6', name: 'Αίθουσα Ανάγνωσης', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 43 },
        ]
    },
    {
        id: 'elementary',
        nameGr: 'Δημοτικό',
        nameEn: 'Elementary School',
        sqMeters: 1450,
        floors: 2,
        totalRooms: 14,
        roomsWithSensors: 10,
        currentConsumption: 52.3,
        avgTemperature: 21.8,
        avgHumidity: 48,
        occupancyPercent: 75,
        rooms: [
            { id: 'e1', name: 'Α\' Τάξη', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 45 },
            { id: 'e2', name: 'Β\' Τάξη', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 47 },
            { id: 'e3', name: 'Γ\' Τάξη', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 46 },
            { id: 'e4', name: 'Δ\' Τάξη', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 48 },
            { id: 'e5', name: 'Ε\' Τάξη', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 23, humidity: 49 },
            { id: 'e6', name: 'ΣΤ\' Τάξη', floor: 2, hasSensors: true, sensorStatus: 'warning', temperature: 25, humidity: 53 },
            { id: 'e7', name: 'Εργαστήριο Η/Υ', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 20, humidity: 40 },
            { id: 'e8', name: 'Βιβλιοθήκη', floor: 2, hasSensors: false, sensorStatus: 'offline' },
        ]
    },
    {
        id: 'lyceum',
        nameGr: 'Γυμνάσιο-Λύκειο',
        nameEn: 'Middle & High School',
        sqMeters: 2800,
        floors: 3,
        totalRooms: 24,
        roomsWithSensors: 18,
        currentConsumption: 89.7,
        avgTemperature: 21.5,
        avgHumidity: 46,
        occupancyPercent: 68,
        rooms: [
            { id: 'l1', name: 'Α\' Γυμνασίου', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 45 },
            { id: 'l2', name: 'Β\' Γυμνασίου', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 44 },
            { id: 'l3', name: 'Γ\' Γυμνασίου', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 46 },
            { id: 'l4', name: 'Α\' Λυκείου', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 47 },
            { id: 'l5', name: 'Β\' Λυκείου', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 21, humidity: 45 },
            { id: 'l6', name: 'Γ\' Λυκείου', floor: 3, hasSensors: true, sensorStatus: 'online', temperature: 22, humidity: 46 },
            { id: 'l7', name: 'Εργαστήριο Φυσικής', floor: 2, hasSensors: true, sensorStatus: 'warning', temperature: 24, humidity: 51 },
            { id: 'l8', name: 'Εργαστήριο Χημείας', floor: 2, hasSensors: true, sensorStatus: 'online', temperature: 20, humidity: 42 },
            { id: 'l9', name: 'Αίθουσα Τέχνης', floor: 3, hasSensors: false, sensorStatus: 'offline' },
            { id: 'l10', name: 'Γυμναστήριο', floor: 1, hasSensors: true, sensorStatus: 'online', temperature: 19, humidity: 50 },
        ]
    }
];
