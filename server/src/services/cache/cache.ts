import { createClient } from 'redis';
import config from '../../config/config';
import { Pilot } from '../../types';
import { fetchViolatingDrones } from '../drones/drones';
import { fetchPilot, formatPilot, generateUnknowPilot } from '../pilot/pilot';
import { sendDroneReport, sendPilot } from '../websocket/server';

let pollInterval = config.DRONE_POLL_INTERVAL;

const client = createClient({
  url: config.REDIS_URI
});

client.on('connect', () => {
  console.log('Redis client connected');

  const updatePollInterval = async (): Promise<void> => {
    const data = await fetchViolatingDrones();
    if (data?.report) pollInterval = Number(data.report.deviceInformation.updateIntervalMs) ?? pollInterval;
  };

  updatePollInterval()
    .then(() => {
      console.log(`Poll interval set to ${pollInterval}ms`);
    })
    .finally(() => {
      setInterval(() => {
        void updateDrones();
      }, pollInterval);
    });
});

client.on('error', (err) => {
  console.log(err);
});

export const getPilots = async (): Promise<Pilot[]> => {
  const pilotIds = await client.zRange('pilots', 0, -1);
  if (!pilotIds.length) return [];

  const pilots = await client.mGet(pilotIds);

  return pilots.flatMap((pilot) => (pilot ? JSON.parse(pilot) : []));
};

const storePilot = async (pilot: Required<Pilot>): Promise<boolean> => {
  await client.set(pilot.pilotId, JSON.stringify(pilot));
  await client.zAdd('pilots', { score: new Date().getTime(), value: pilot.pilotId });

  return true;
};

const removeExpiredKeys = async (): Promise<boolean> => {
  const expiredPilotIds = await client.zRangeByScore('pilots', '-inf', new Date().getTime() - config.CACHE_TTL);
  if (expiredPilotIds.length) {
    await client.del(expiredPilotIds);
    await client.zRem('pilots', expiredPilotIds);
  }

  return true;
};

const updateDrones = async (): Promise<void> => {
  try {
    void removeExpiredKeys();
    const newDrones = await fetchViolatingDrones();

    if (newDrones) {
      sendDroneReport(newDrones);

      const pilots = await getPilots();

      for (const drone of newDrones.report.capture.drone) {
        const pilot =
        pilots.find((pilot) => pilot.drone.serialNumber === drone.serialNumber) ??
        (await fetchPilot(drone.serialNumber));

        const formattedPilot = formatPilot(
          pilot ?? generateUnknowPilot(),
          newDrones.report.capture.$.snapshotTimestamp,
          drone
        );

        sendPilot(formattedPilot);
        void storePilot(formattedPilot);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export default client;
