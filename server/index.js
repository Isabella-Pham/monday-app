const express = require('express');
const { createServer } = require('http');
const path = require('path');
const attachSocketServer = require('./wsServer');
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app = express();
const server = createServer(app);
attachSocketServer(server);

app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

server.listen(port, function () {
 console.log('Server listening on port: ' + port);
});
