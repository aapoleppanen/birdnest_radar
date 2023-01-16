/**
 * Routing
 */
interface UrlPathOptions {
  routeParams?: Record<string, string | number>
  queryParams?: Record<string, string>
}

/**
 * Drones
 */

interface DroneReport {
  report: {
    deviceInformation: DeviceInformation
    capture: DroneCapture
  }

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
  timeOfLastViolation?: string
  closestDistance?: number
  drone: Drone
}

export { UrlPathOptions, DroneReport, Pilot, Drone };
