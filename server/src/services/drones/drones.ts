import config from '../../config/config';
import xml2js from 'xml2js';
import fetch from 'node-fetch';
import { Drone, DroneReport } from '../../types';

const fetchViolatingDrones = async (): Promise<DroneReport | null> => {
  try {
    const dronesResponse = await fetch(config.DRONE_API_URL);
    const dronesXMLstring = await dronesResponse.text();
    const droneReport: DroneReport = await xml2js.parseStringPromise(dronesXMLstring, { explicitArray: false });

    const violatingDrones = droneReport.report.capture.drone.filter(
      (drone) => calculateDistanceToNest(drone) < config.NDZ_RADIUS
    );

    return {
      ...droneReport,
      report: { ...droneReport.report, capture: { ...droneReport.report.capture, drone: violatingDrones } }
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

const calculateDistanceToNest = (drone: Drone): number => {
  const x = parseFloat(drone.positionY);
  const y = parseFloat(drone.positionX);

  return Math.sqrt(Math.pow(x - config.NEST_COORDINATES.x, 2) + Math.pow(y - config.NEST_COORDINATES.y, 2));
};

export { fetchViolatingDrones, calculateDistanceToNest };
