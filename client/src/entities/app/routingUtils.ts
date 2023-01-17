/**
 * In development, returns the URL of the local server.
 */
export const getOriginUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }

  return window.location.origin;
};

export const getWebsocketUrl = () => {
  if (import.meta.env.DEV) {
    return 'ws://localhost:8080';
  }

  return 'wss://' + window.location.host;
};
