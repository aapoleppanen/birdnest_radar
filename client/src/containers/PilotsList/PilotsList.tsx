import { Drone, Pilot } from '../../types';
import { format } from 'date-fns';
import * as Tooltip from '@radix-ui/react-tooltip';
import droneIcon from '../../assets/camera-drone.png';
import './styles.css';
import { sortPilots } from '../../entities/pilots';

type Props = {
  pilots: Pilot[];
  drones: Drone[];
};

const PilotList = ({ pilots, drones }: Props) => {
  return (
    <Tooltip.Provider>
      <div className="overflow-x-auto lg:overflow-y-scroll h-full lg:h-screen w-full max-w-full">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>
                Closest <br />
                violation distance
              </th>
              <th>Time</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Drone</th>
            </tr>
          </thead>
          <tbody>
            {sortPilots(pilots).map((pilot) => (
              <tr
                key={pilot.pilotId}
                className={`${
                  // If the pilot has a drone that is in currently in the NDZ, highlight the row
                  // otherwise highlight on hover
                  drones.some((drone) => drone.serialNumber === pilot.drone.serialNumber)
                    ? '[&>td]:bg-red-500'
                    : 'hover'
                }`}
              >
                <td>{pilot.firstName}</td>
                <td>{pilot.lastName}</td>
                <td>{`${Math.round(Number(pilot.closestDistance) / 100) / 10} m`}</td>
                <td>{format(new Date(pilot.timeOfLastViolation), 'HH:mm')}</td>
                <td>{pilot.email}</td>
                <td>{pilot.phoneNumber}</td>
                <Tooltip.Root delayDuration={0} disableHoverableContent>
                  <Tooltip.Trigger asChild>
                    <td className="flex items-center justify-center cursor-pointer group">
                      <img src={droneIcon} alt="" className="w-7 h-7 invert group-hover:opacity-50" />
                    </td>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={3} className="TooltipContent">
                      <div className="bg-gray-700 p-2 rounded">
                        <p>Serial Number: {pilot.drone.serialNumber}</p>
                        <p>Model: {pilot.drone.model}</p>
                        <p>Manufacturer: {pilot.drone.manufacturer}</p>
                      </div>
                      <Tooltip.Arrow className="TooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tooltip.Provider>
  );
};

export default PilotList;
