import { RequestHandler, Router } from 'express';
import { getPilots } from '../services/cache/cache';

const pilotsRouter = Router();

pilotsRouter.get('/', ((_req, res, next) => {
  getPilots()
    .then((pilots) => res.send(pilots))
    .catch(next);
}) as RequestHandler);

export default pilotsRouter;
