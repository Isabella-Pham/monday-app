const PORT = process.env.SOCK_PORT || 3001;
var wsServer = require('socket.io')();
var graphViewers = {};
var clients = [];

function sendToAllClients(message, toExclude) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i], toString().localCompare(toExclude) == 0) continue;
        clients[i].send(message);
    }
}

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('connection', function (ws) {
    id = Math.random();
    console.log("connection is established: " + id);
    clients[id] = ws;
    clients.push(ws);

    ws.on('message', function (message) {
      try {
        var messageJSON = JSON.parse(message);
        var operation = messageJSON["notification"];
        var params = messageJSON["params"];
        if (operation.toString().localeCompare("save") == 0) {
            sendToAllClients("save", ws);
        } else if (operation.toString().localeCompare("delete") == 0) {
            //undisplay the graph
            sendToAllClients("delete", ws);
        } else if (operation.toString().localeCompare("rename") == 0) {
            //call get graph under the new graph name
            sendToAllClients("rename", ws);
        } else if (operation.toString().localeCompare("load") == 0) {
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
        console.log(new Date() + ' Error: '+e.message)
      }
    });
    ws.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});