import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import config from '../../config/config';
import { Drone, Pilot } from '../../types';
import { getUrlPath } from '../../util/routingUtils';
import { calculateDistanceToNest } from '../drones/drones';

const fetchPilot = async (serialNumber: string): Promise<Pilot | null> => {
  try {
    const pilotResponse = await fetch(getUrlPath(config.PILOT_API_URL, { routeParams: { serialNumber } }));
    const pilot: Pilot = await pilotResponse.json();

    return pilot;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * Format the pilot object to include the drone and the timestamp of the last violation
 */
const formatPilot = (pilot: Omit<Pilot, 'drone'>, timestamp: string, drone: Drone): Required<Pilot> => {
  let closestDistance = pilot.closestDistance;
  const newDistance = calculateDistanceToNest(drone);
  if (!closestDistance || closestDistance > calculateDistanceToNest(drone)) closestDistance = newDistance;

  return { ...pilot, timeOfLastViolation: timestamp, closestDistance, drone };
};

/**
 * Generate a pilot object with unknown information
 */
const generateUnknowPilot = (): Omit<Pilot, 'drone'> => ({
  pilotId: `unknown:${randomUUID()}`,
  firstName: 'Unknown',
  lastName: 'Unknown',
  phoneNumber: 'Unknown',
  email: 'Unknown',
  createDt: new Date().toISOString()
});

export { fetchPilot, formatPilot, generateUnknowPilot };
