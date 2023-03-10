import { useState } from 'react';
import { DeviceInformation, Drone, DroneReport } from '../types';

/**
 * Custom hook for handling drone data
 * @returns drones, device information and a function for handling drone report
 */
export const useDrones = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [deviceInformation, setDeviceInformation] = useState<DeviceInformation | null>(null);

  const handleDroneReport = (report: DroneReport) => {
    const { drone } = report.report.capture;
    const { deviceInformation } = report.report;

    setDrones(drone);
    setDeviceInformation(deviceInformation);
  };

  return [drones, deviceInformation, handleDroneReport] as const;
};
