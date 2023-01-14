import { useEffect, useRef, useState } from 'react';
import DroneMap from './containers/DroneMap/DroneMap';
import PilotList from './containers/PilotsList/PilotsList';
import { useDrones } from './entities/drones';
import { usePilots } from './entities/pilots';
import { Drone, DroneReport, Pilot } from './types';

const App = () => {
  const [drones, setDrones] = useDrones();
  const [pilots, setPilots] = usePilots();

  const [hoveredPilot, setHoveredPilot] = useState<Pilot | null>(null);
  const [hoveredDrone, setHoveredDrone] = useState<Drone | null>(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onopen = () => console.log('connected');
    ws.current.onclose = () => console.log('disconnected');
    ws.current.onerror = (err) => console.log('error', err);

    ws.current.onmessage = (event) => {
      const data: DroneReport | Pilot = JSON.parse(event.data);

      if ('pilotId' in data) setPilots(pilots => [...pilots, data]);
      if ('report' in data) {
        setDrones(data.report.capture.drone);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className='flex'>
      <PilotList pilots={pilots} setHoveredPilot={setHoveredPilot} hoveredDrone={hoveredDrone}/>
      <DroneMap drones={drones} setHoveredDrone={setHoveredDrone} hoveredPilot={hoveredPilot} />
    </div>
  );
};

export default App;
