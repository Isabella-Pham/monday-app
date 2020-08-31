require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const path = require('path');
const { attachSocketServer } = require('./wsServer');
const port = process.env.PORT || 3000;
const apiRoutes = require('./backend');
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app = express();
const server = createServer(app);

attachSocketServer(server);

mongoose.connect(
  'mongodb+srv://'+ process.env.MONGO_DB_USER +':'+ process.env.MONGO_DB_PASS + "@cluster0.8meef.mongodb.net/test?retryWrites=true&w=majority",
  {
      auth: {
          user: process.env.MONGO_DB_USER,
          password: process.env.MONGO_DB_PASS
      },
      useNewUrlParser: true
  },
  function(err, client) {
      if (err) {
          console.log(err);
      } else {
        console.log('Connected to Mongo DB');
      }
  }
);

app.use(express.static(DIST_DIR));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

server.listen(port, function () {
 console.log('Server listening on port: ' + port);
});
