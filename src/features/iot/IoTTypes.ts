import type { Ionicons } from '@expo/vector-icons';

export type Device = {
    id: number;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
};

export type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};
