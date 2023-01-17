import { useEffect, useState } from 'react';
import { Pilot } from '../types';
import { getOriginUrl } from './app/routingUtils';

export const usePilots = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);

  const fetchpilots = async () => {
    const controller = new AbortController();
    const { signal } = controller;

    const response = await fetch(`${getOriginUrl()}/pilots`, { signal });

    if (response.ok) {
      const pilots = await response.json();

      setPilots(pilots);
    }

    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    fetchpilots();
  }, []);

  return [pilots, setPilots] as const;
};

export const sortPilots = (pilots: Pilot[]) =>
  pilots.sort((a, b) =>
    new Date(a.timeOfLastViolation).getTime() < new Date(b.timeOfLastViolation).getTime()
      ? 1
      : a.timeOfLastViolation === b.timeOfLastViolation
        ? a.closestDistance > b.closestDistance
          ? 1
          : -1
        : -1
  );
