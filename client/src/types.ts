/**
 * Drones
 */
interface Drone {
  serialNumber: string
  model: string
  manufacturer: string
  mac: string
  ipv4: string
  ipv6: string
  firmware: string
  positionY: string
  positionX: string
  altitude: string
}

interface DeviceInformation {
  $: {
    deviceID: string
  }
  listenRange: string
  deviceStarted: string
  uptimeSeconds: string
  updateIntervalMs: string
};

interface DroneCapture {
  $: {
    snapshotTimestamp: string
  }
  drone: Drone[]
}

interface DroneReport {
  report: {
    deviceInformation: DeviceInformation[]
    capture: DroneCapture
  }
}

/**
 * Pilots
 */

interface Pilot {
  pilotId: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  createDt: string // date
  droneSerialNumber: string
  timeOfLastViolation: string
  closestDistance: number
}

export type { DroneReport, Pilot, Drone };
