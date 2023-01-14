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

const formatPilot = (pilot: Pilot, timestamp: string, drone: Drone): Required<Pilot> => {
  let closestDistance = pilot.closestDistance;
  const newDistance = calculateDistanceToNest(drone);
  if (!closestDistance || closestDistance > calculateDistanceToNest(drone)) closestDistance = newDistance;

  return { ...pilot, timeOfLastViolation: timestamp, closestDistance, drone };
};

export { fetchPilot, formatPilot };
