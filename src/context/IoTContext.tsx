import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';

import { Device, SensorData } from '../models/IoTModels';

import {
    getDevices,
    getSensorData,
    updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData | null;
    isGatewayConnected: boolean;
    devicesLoading: boolean;
    sensorsLoading: boolean;
    devicesError: string | null;
    sensorsError: string | null;
    updatingDeviceId: number | null;
    toggleDevice: (id: number, value: boolean) => void;
    refreshSensors: () => void;
    retryDevices: () => void;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData | null>(null);

    const [isGatewayConnected, setIsGatewayConnected] = useState(true);

    const [devicesLoading, setDevicesLoading] = useState(false);
    const [sensorsLoading, setSensorsLoading] = useState(false);

    const [devicesError, setDevicesError] = useState<string | null>(null);
    const [sensorsError, setSensorsError] = useState<string | null>(null);

    const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(
        null
    );

    const fetchDevices = async () => {

        setDevicesLoading(true);
        setDevicesError(null);

        try {
            const data = await getDevices();

            setDevices(data);
            setIsGatewayConnected(true);
        } catch (error) {
            // A failed device fetch is treated as a gateway
            // disconnection, which also disables the switches.
            setDevicesError('Unable to retrieve devices.');
            setIsGatewayConnected(false);
        } finally {
            setDevicesLoading(false);
        }
    };

    const fetchSensors = async () => {

        setSensorsLoading(true);
        setSensorsError(null);

        try {
            const data = await getSensorData();

            setSensors(data);
        } catch (error) {
            setSensorsError('Unable to retrieve sensor data.');
        } finally {
            setSensorsLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        fetchSensors();
    }, []);

    const toggleDevice = async (
        id: number,
        value: boolean
    ) => {

        if (!isGatewayConnected) {
            return;
        }

        const device = devices.find((d) => d.id === id);

        setUpdatingDeviceId(id);
        setDevicesError(null);

        try {
            const updated = await updateDeviceStatus(id, value);

            setDevices((prev) =>
                prev.map((d) => (d.id === id ? updated : d))
            );
        } catch (error) {
            setDevicesError(
                `Unable to update ${device ? device.name : 'device'}.`
            );
        } finally {
            setUpdatingDeviceId(null);
        }
    };

    const refreshSensors = () => {
        fetchSensors();
    };

    const retryDevices = () => {
        fetchDevices();
    };

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                isGatewayConnected,
                devicesLoading,
                sensorsLoading,
                devicesError,
                sensorsError,
                updatingDeviceId,
                toggleDevice,
                refreshSensors,
                retryDevices,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}
