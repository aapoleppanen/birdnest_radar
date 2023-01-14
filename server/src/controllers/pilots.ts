import { RequestHandler, Router } from 'express';
import { getPilots } from '../services/cache/cache';
import { fetchPilot } from '../services/pilot/pilot';

const pilotsRouter = Router();

pilotsRouter.get('/:serialNumber', (async (req, res) => {
  const pilots = await getPilots();
  const pilot =
    pilots.find((pilot) => pilot.droneSerialNumber === req.params.serialNumber) ??
    (await fetchPilot(req.params.serialNumber));

  res.send(pilot);
}) as RequestHandler);

pilotsRouter.get('/', (async (_req, res) => {
  const pilots = await getPilots();

  res.send(pilots);
}) as RequestHandler);

export default pilotsRouter;
