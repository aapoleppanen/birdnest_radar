import { createClient } from 'redis';
import config from '../../config/config';
import { Pilot } from '../../types';
import { fetchViolatingDrones } from '../drones/drones';
import { fetchPilot, formatPilot, generateUnknowPilot } from '../pilot/pilot';
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

export const getPilots = async (): Promise<Pilot[]> => {
  try {
    const pilotIds = await client.zRange('pilots', 0, -1);
    if (!pilotIds) return [];

    const pilots = await client.mGet(pilotIds);

    return pilots.flatMap((pilot) => pilot ? JSON.parse(pilot) : []);
  } catch (err) {
    console.log(err);
    return [];
  }
};

const storePilot = async (pilot: Required<Pilot>): Promise<boolean> => {
  try {
    await client.set(pilot.pilotId, JSON.stringify(pilot));
    await client.zAdd('pilots', { score: new Date().getTime(), value: pilot.pilotId });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const removeExpiredKeys = async (): Promise<boolean> => {
  try {
    const expiredPilotIds = await client.zRangeByScore('pilots', '-inf', new Date().getTime() - config.CACHE_TTL);
    if (expiredPilotIds.length) {
      await client.del(expiredPilotIds);
      await client.zRem('pilots', expiredPilotIds);
    }

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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    newDrones.report.capture.drone.forEach(async (drone) => {
      const pilot =
        pilots.find((pilot) => pilot.drone.serialNumber === drone.serialNumber) ??
        (await fetchPilot(drone.serialNumber));
      if (pilot) {
        const formattedPilot = formatPilot(pilot, newDrones.report.capture.$.snapshotTimestamp, drone);
        sendPilot(formattedPilot);
        void storePilot(formattedPilot);
      } else {
        const unknownPilot = generateUnknowPilot();
        const formattedPilot = formatPilot(unknownPilot, newDrones.report.capture.$.snapshotTimestamp, drone);
        sendPilot(formattedPilot);
        void storePilot(formattedPilot);
      }
    });
  }
};

export default client;
