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


process.on('SIGINT', () => {
  wss.clients.forEach(function each(client) {
    client.close();
  })
  server.close(() => {
      shutdownDb()
  })
})

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

    db.run(`INSERT INTO visitors (counts, time) VALUES (${numClients}, datetime('now'))`)

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

/** Begin database **/
const sqlite = require('sqlite3')
const db = new sqlite.Database(':memory:')

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      counts INTEGER,
      time TEXT
    )
`)
})


function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row)
  })
}

function shutdownDb() {
  getCounts();
  console.log("Shutting down db")
  db.close()
}
