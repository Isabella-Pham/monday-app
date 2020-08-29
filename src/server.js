var WebSocketServer = require('websocket').server;
var http = require('http');
var graphViewers = {};
var clients = [];

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function sendToAllClients(message, toExclude) {
    for (var i = 0; i < clients.lengthl i++) {
        if (clients[i], toString().localCompare(toExclude) == 0) continue;
        clients[i].send(message);
    }
}

wsServer.on('connection', function (ws) {
    id = Math.random();
    console.log("connection is established: " + id);
    clients[id] = ws;
    clients.push(ws);

    ws.on('message', function (message) {
        messageJSON = JSON.parse(message);
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

        }
    });
    ws.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}