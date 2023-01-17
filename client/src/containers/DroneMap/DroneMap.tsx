import { Drone } from '../../types';
import './styles.css';

type Props = {
  drones: Drone[];
};

const DroneMap = ({ drones }: Props) => {
  return (
    <div
      className="border rounded-full flex items-center justify-center overflow-hidden m-4"
      style={{
        width: '500px',
        height: '500px'
      }}
    >
      <div className="translate-y-1/2">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="radar-div animate-radar border rounded-full border-green-200" />
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        {drones.map((drone) => (
          <div
            key={drone.serialNumber}
            className="-translate-x-1/2 -translate-y-1/2"
            style={{
              position: 'absolute',
              top: `${(Number(drone.positionY) - 250000) * 0.0025}px`,
              left: `${(Number(drone.positionX) - 250000) * 0.0025}px`
            }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneMap;
