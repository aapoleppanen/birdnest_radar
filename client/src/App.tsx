import DeviceInfo from './containers/DeviceInfo/DeviceInfo';
import DroneMap from './containers/DroneMap/DroneMap';
import PilotList from './containers/PilotsList/PilotsList';
import { useInterval } from './entities/app/interval';
import { useDrones } from './entities/drones';
import { usePilots } from './entities/pilots';
import useWebSocket from './entities/websocket';
import { DroneReport, Pilot } from './types';

const App = () => {
  const [drones, deviceInformation, handleDroneReport] = useDrones();
  const [pilots, setPilots] = usePilots();

  const handleUpdate = (event: MessageEvent<any>) => {
    const data: DroneReport | Pilot = JSON.parse(event.data);

    if ('pilotId' in data) {
      // Use setStateAction callback to avoid stale state
      setPilots((pilots) => {
        const pilotIndex = pilots.findIndex((pilot) => pilot.pilotId === data.pilotId);

        if (pilotIndex === -1) return [...pilots, data];

        const newPilots = [...pilots];
        newPilots[pilotIndex] = data;

        return newPilots;
      });
    }
    if ('report' in data) {
      handleDroneReport(data);
    }
  };

  const { connect, status } = useWebSocket({ onMessage: handleUpdate });

  useInterval(connect, status === WebSocket.CLOSED ? 1000 : null);

  return (
    <div className="flex flex-col h-screen w-screen max-w-full">
      <div className="flex justify-between bg-gray-800 border border-bottom border-gray-900">
        <div className="flex-1 text-center p-4">
          <h1 className="text-4xl">Birdnest Radar</h1>
          <h3 className="text-lg">Real-time NDZ violations</h3>
        </div>
        <div className="flex items-center">
          <a
            className="m-1 text-xs"
            href="https://www.flaticon.com/free-icons/camera-drone"
            title="Camera drone icons created by Smashicons - Flaticon"
          >
            Attribution
          </a>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row overflow-y-auto lg:overflow-y-hidden lg:overflow-hidden-x">
        <div className="flex w-full min-w-0">
          <PilotList pilots={pilots} drones={drones} />
        </div>
        <div className="flex flex-shrink-0 flex-col items-center mb-4 lg:mb-0">
          <DroneMap drones={drones} />
          <div className="flex justify-between">
            <DeviceInfo deviceInformation={deviceInformation} />
            {status === WebSocket.CLOSED && (
              <div className="mx-6">
                <div className="mb-1">Radar Disconnected</div>
                <div className="text-xs">Attempting to reconnect...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
