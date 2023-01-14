const isoToUnix = (iso: string): number => {
  return new Date(iso).getTime();
};

export { isoToUnix };
