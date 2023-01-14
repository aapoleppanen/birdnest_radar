import { useEffect, useState } from 'react';
import { Drone } from '../types';

export const useDrones = () => {
  const [drones, setDrones] = useState<Drone[]>([]);

  const fetchDrones = async () => {
    const controller = new AbortController();
    const { signal } = controller;

    const response = await fetch('/drones/cache', { signal });

    if (response.ok) {
      const drones = await response.json();

      setDrones(drones);
    }

    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  return [drones, setDrones] as const;
};
