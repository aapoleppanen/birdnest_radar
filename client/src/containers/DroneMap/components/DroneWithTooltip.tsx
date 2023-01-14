import { Drone, Pilot } from '../../../types';
import * as Tooltip from '@radix-ui/react-tooltip';
import './styles.css';
import { useEffect, useState } from 'react';

type Props = {
  drone: Drone
  setHoveredDrone: (drone: Drone | null) => void
  hoveredPilot: Pilot | null
}

const DroneWithTooltip = ({ drone, setHoveredDrone, hoveredPilot }: Props) => {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setHoveredDrone(drone);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setHoveredDrone(null);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(hoveredPilot?.droneSerialNumber === drone.serialNumber);
  }, [hoveredPilot]);

  return (
    <Tooltip.Provider >
      <Tooltip.Root delayDuration={0} disableHoverableContent open={open}>
        <Tooltip.Trigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="w-3 h-3 bg-red-500 rounded-full" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
        <Tooltip.Content
        sideOffset={3}
        className="TooltipContent"
        >
          <div className="bg-gray-700 p-2 rounded">
            <p>Serial Number: {drone.serialNumber}</p>
            <p>Model: {drone.model}</p>
            <p>Manufacturer: {drone.manufacturer}</p>
          </div>
          <Tooltip.Arrow className="TooltipArrow"/>
        </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default DroneWithTooltip;
