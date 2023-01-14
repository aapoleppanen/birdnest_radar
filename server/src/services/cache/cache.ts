import { createClient } from 'redis';
import config from '../../config/config';
import { Drone, Pilot } from '../../types';
import { isoToUnix } from '../../util/dateUtils';
import { fetchViolatingDrones } from '../drones/drones';
import { fetchPilot, formatPilot } from '../pilot/pilot';
import { sendDroneReport, sendPilot } from '../websocket/server';

const client = createClient({
  url: config.REDIS_URI
});

client.on('connect', () => {
  console.log('Redis client connected');

  setInterval(() => {
    void updateDrones();
  }, config.DRONE_POLL_INTERVAL);
});

client.on('error', (err) => {
  console.log(`Something went wrong ${JSON.stringify(err)}`);
});

export const getDrones = async (): Promise<Drone[]> => {
  try {
    const drones = await client.zRange('drones', 0, -1);

    return drones.map((drone) => JSON.parse(drone));
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getPilots = async (): Promise<Pilot[]> => {
  try {
    const pilots = await client.zRange('pilots', 0, -1);

    return pilots.map((pilot) => JSON.parse(pilot));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const storeDrone = async (drone: Drone, timestamp: string): Promise<boolean> => {
  try {
    await client.zAdd('drones', { score: isoToUnix(timestamp), value: JSON.stringify(drone) });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const storePilot = async (pilot: Required<Pilot>): Promise<boolean> => {
  try {
    await client.zAdd('pilots', {
      score: isoToUnix(pilot.timeOfLastViolation),
      value: JSON.stringify(pilot)
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const removeExpiredKeys = async (): Promise<boolean> => {
  try {
    await client.zRemRangeByScore('drones', '-inf', new Date().getTime() - config.CACHE_TTL);
    await client.zRemRangeByScore('pilots', '-inf', new Date().getTime() - config.CACHE_TTL);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const updateDrones = async (): Promise<void> => {
  void removeExpiredKeys();
  const newDrones = await fetchViolatingDrones();

  if (newDrones) {
    sendDroneReport(newDrones);

    const pilots = await getPilots();
    const drones = await getDrones();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    newDrones.report.capture.drone.forEach(async (drone) => {
      if (drones.find((d) => d.serialNumber === drone.serialNumber)) return;

      void storeDrone(drone, newDrones.report.capture.$.snapshotTimestamp);

      const pilot =
        pilots.find((pilot) => pilot.droneSerialNumber === drone.serialNumber) ??
        (await fetchPilot(drone.serialNumber));
      if (pilot) {
        const formattedPilot = formatPilot(pilot, newDrones.report.capture.$.snapshotTimestamp, drone);
        sendPilot(formattedPilot);
        void storePilot(formattedPilot);
      }
    });
  }
};

export default client;
