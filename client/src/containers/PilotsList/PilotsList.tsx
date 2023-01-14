import { Drone, Pilot } from '../../types';
import { format } from 'date-fns';

type Props = {
  pilots: Pilot[];
  setHoveredPilot: (pilot: Pilot | null) => void;
  hoveredDrone: Drone | null;
};

const PilotList = ({ pilots, setHoveredPilot, hoveredDrone }: Props) => {
  return (
    <div className="overflow-x-auto overflow-y-scroll h-screen">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Distance To nest</th>
            <th>Time</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {pilots.sort((a, b) => a.closestDistance > b.closestDistance ? 1 : -1).map((pilot) => (
            <tr
              key={pilot.pilotId}
              onMouseEnter={() => setHoveredPilot(pilot)}
              onMouseLeave={() => setHoveredPilot(null)}
              className={hoveredDrone && hoveredDrone.serialNumber === pilot.droneSerialNumber ? 'active' : 'hover'}
            >
              <td>{pilot.firstName}</td>
              <td>{pilot.lastName}</td>
              <td>{`${Math.round(Number(pilot.closestDistance) / 10) / 10} m`}</td>
              <td>{format(new Date(pilot.timeOfLastViolation), 'HH:mm')}</td>
              <td>{pilot.email}</td>
              <td>{pilot.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PilotList;
