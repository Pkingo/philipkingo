const express  = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: __dirname})

})

server.on('request', app);
server.listen(3000, function () {
  console.log('Listening on 3000')
});

/** Websocket **/
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;

  console.log(`clients connected: ${numClients}`);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readState === ws.OPEN) {
    ws.send('Wecome!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    // handle error
    console.log('An error happened for the clients');
    
  })
})

/**
 * Broadcast data to all connected clients
 * @param {Object} data
 * @void
 **/
wss.broadcast = function broadcast(data) {
    console.log('Broadcasting data', data);
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  }
/** End Websocket **/
