const PORT = process.env.PORT ?? 8080;
const DRONE_POLL_INTERVAL = 2000;
const REDIS_URI =
  process.env.NODE_ENV === 'production'
    ? `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_IP ?? '6379'}`
    : process.env.REDIS_URI_DEV;
const DRONE_API_URL = 'https://assignments.reaktor.com/birdnest/drones';
const PILOT_API_URL = 'https://assignments.reaktor.com/birdnest/pilots/:serialNumber';
const CACHE_TTL = 600000;
const NEST_COORDINATES = { x: 250000, y: 250000 };
const NDZ_RADIUS = 100000;

const config = {
  PORT,
  DRONE_POLL_INTERVAL,
  REDIS_URI,
  DRONE_API_URL,
  PILOT_API_URL,
  CACHE_TTL,
  NEST_COORDINATES,
  NDZ_RADIUS
};

export default config;
