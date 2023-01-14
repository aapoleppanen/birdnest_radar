import { Router, RequestHandler } from 'express';
import { getDrones } from '../services/cache/cache';
import { fetchViolatingDrones } from '../services/drones/drones';

const dronesRouter = Router();

dronesRouter.get('/', (async (_req, res) => {
  const drones = await fetchViolatingDrones();

  res.send(drones);
}) as RequestHandler);

dronesRouter.get('/cache', (async (_req, res) => {
  const drones = await getDrones();

  res.send(drones);
}) as RequestHandler);

export default dronesRouter;
