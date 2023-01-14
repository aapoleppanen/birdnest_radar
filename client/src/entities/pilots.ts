import { useEffect, useState } from 'react';
import { Pilot } from '../types';

export const usePilots = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);

  const fetchpilots = async () => {
    const controller = new AbortController();
    const { signal } = controller;

    const response = await fetch('/pilots', { signal });

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
