import http from 'http';
import app from './app';
import config from './config/config';
import websocketServer from './services/websocket/server';

const server = http.createServer(app);

server.on('upgrade', function upgrade (request, socket, head) {
  websocketServer.handleUpgrade(request, socket, head, function done (w) {
    websocketServer.emit('connection', w, request);
  });
});

server.listen(config.PORT);
console.log(`Server running on port ${config.PORT}`);
