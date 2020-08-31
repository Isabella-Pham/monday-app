const PORT = process.env.SOCK_PORT || 3000;
const socketIO = require('socket.io');
var graphViewers = {};
var clients = [];

function sendToAllClients(message, toExclude) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === toExclude) continue;
        clients[i].socket.send(message);
    }
}

module.exports.attachSocketServer = function(server) {
  var wsServer = socketIO(server);
  wsServer.on('connect', function (ws) {
    const id = Math.random();
    console.log("connection is established: " + id);
    clients.push({
      socket: ws,
      id: id
    });

    ws.send(JSON.stringify({
      message: 'init',
      id: id
    }));

    ws.on('message', function (message) {
      try {
        var messageJSON = JSON.parse(message);
        var operation = messageJSON["message"];
        var params = messageJSON["params"];
        if (operation.toString().localeCompare("save") === 0) {
            sendToAllClients("save", id);
        } else if (operation.toString().localeCompare("delete") === 0) {
            //undisplay the graph
            sendToAllClients("delete", id);
        } else if (operation.toString().localeCompare("rename") === 0) {
            //call get graph under the new graph name
            sendToAllClients("rename", id);
        } else if (operation.toString().localeCompare("load") === 0) {
            viewers = [];
            if (!graphViewers[params["graphName"]]) {
                viewers = graphViewers["graphName"];
            }
            viewers.push(id);
            graphViewers["graphName"] = viewers;
        } else {
          console.log(messageJSON);
        }
      } catch(e) {
        console.log(new Date() + ' Error: ' + e.message)
      }
    });
    ws.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}

module.exports.sendMessageToClients = function(message, clientId) {
  sendToAllClients(message, clientId);
}