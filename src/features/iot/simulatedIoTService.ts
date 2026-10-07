import type { Device, SensorData } from './IoTTypes';

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// In-memory store so status changes persist between calls,
// standing in for a real IoT backend.
const devices: Device[] = [
    {
        id: 1,
        name: 'Living Room Light',
        type: 'Smart Light',
        icon: 'bulb-outline',
        status: true,
    },
    {
        id: 2,
        name: 'Bedroom Fan',
        type: 'Smart Fan',
        icon: 'sync-outline',
        status: false,
    },
    {
        id: 3,
        name: 'Front Door Lock',
        type: 'Smart Lock',
        icon: 'lock-closed-outline',
        status: true,
    },
];

const FAILURE_RATE = 0.15;

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getDevices(): Promise<Device[]> {
    await delay(1200);

    if (Math.random() < FAILURE_RATE) {
        throw new Error('Unable to retrieve devices.');
    }

    return devices.map((device) => ({ ...device }));
}

export async function getSensorData(): Promise<SensorData> {
    await delay(1500);

    if (Math.random() < FAILURE_RATE) {
        throw new Error('Unable to retrieve sensor data.');
    }

    return {
        temperature: randomBetween(18, 32),
        humidity: randomBetween(40, 80),
        lightLevel: randomBetween(200, 900),
    };
}

export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {
    await delay(800);

    const device = devices.find((d) => d.id === id);

    if (!device) {
        throw new Error('Device not found.');
    }

    if (Math.random() < FAILURE_RATE) {
        throw new Error(`Unable to update ${device.name}.`);
    }

    device.status = status;

    return { ...device };
}
