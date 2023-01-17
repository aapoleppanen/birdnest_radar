import { WebSocketServer, WebSocket } from 'ws';
import { DroneReport, Pilot } from '../../types';

const websocketServer = new WebSocketServer({ noServer: true });

websocketServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(message);
  });
});

websocketServer.on('error', (err) => {
  console.log(err);
});

export const sendDroneReport = (droneReport: DroneReport): void => {
  websocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(droneReport));
    }
  });
};

export const sendPilot = (pilot: Pilot): void => {
  websocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(pilot));
    }
  });
};

export default websocketServer;
