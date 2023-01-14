import { RequestHandler, Router } from 'express';
import { getPilots } from '../services/cache/cache';

const pilotsRouter = Router();

pilotsRouter.get('/', (async (_req, res) => {
  const pilots = await getPilots();

  res.send(pilots);
}) as RequestHandler);

export default pilotsRouter;
