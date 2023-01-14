import { Drone, Pilot } from '../../types';
import DroneWithTooltip from './components/DroneWithTooltip';
import './styles.css';

type Props = {
  drones: Drone[];
  setHoveredDrone: (drone: Drone | null) => void;
  hoveredPilot: Pilot | null;
};

const DroneMap = ({ drones, setHoveredDrone, hoveredPilot }: Props) => {
  return (
    <div
      className="border rounded-full flex items-center justify-center overflow-hidden"
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
              top: `${(Number(drone.positionX) - 250000) * 0.0025}px`,
              left: `${(Number(drone.positionY) - 250000) * 0.0025}px`
            }}
          >
            <DroneWithTooltip drone={drone} setHoveredDrone={setHoveredDrone} hoveredPilot={hoveredPilot} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneMap;
