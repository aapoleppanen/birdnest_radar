import { useEffect, useRef } from 'react';
import DroneMap from './containers/DroneMap/DroneMap';
import PilotList from './containers/PilotsList/PilotsList';
import { useDrones } from './entities/drones';
import { usePilots } from './entities/pilots';
import { DroneReport, Pilot } from './types';

const App = () => {
  const [drones, setDrones] = useDrones();
  const [pilots, setPilots] = usePilots();

  const ws = useRef<WebSocket | null>(null);

  const handleUpdate = (data: DroneReport | Pilot) => {
    if ('pilotId' in data) {
      setPilots(pilots => {
        const pilotIndex = pilots.findIndex((pilot) => pilot.pilotId === data.pilotId);
        if (pilotIndex === -1) return [...pilots, data];
        const newPilots = [...pilots];
        newPilots[pilotIndex] = data;
        return newPilots;
      });
    }
    if ('report' in data) {
      setDrones(data.report.capture.drone);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://' + window.location.host);

    ws.current.onopen = () => console.log('connected');
    ws.current.onclose = () => console.log('disconnected');
    ws.current.onerror = (err) => console.log('error', err);

    ws.current.onmessage = (event) => {
      const data: DroneReport | Pilot = JSON.parse(event.data);

      handleUpdate(data);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex justify-between bg-gray-800 border border-bottom border-gray-900">
        <div className="flex-1 text-center p-4">
          <h1 className="text-4xl">
            Birdnest Radar
          </h1>
          <h3 className="text-lg">
            Real-time NDZ violations
          </h3>
        </div>
        <div className="flex items-center">
          <a className="m-1 text-xs" href="https://www.flaticon.com/free-icons/camera-drone" title="Camera drone icons created by Smashicons - Flaticon">Attribution</a>
        </div>
      </div>
    <div className='flex w-screen overflow-hidden'>
      <div className="flex w-full min-w-0">
      <PilotList pilots={pilots} drones={drones} />
      </div>
      <div className="flex flex-shrink-0 items-center min-w-0">
      <DroneMap drones={drones} />
      </div>
    </div>
    </div>
  );
};

export default App;
