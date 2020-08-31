import io from "socket.io-client";

export default function getSocketClient() {
  let address = window.location.protocol + '//' + window.location.host;
  let client = io(address);
  
  client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
       const  messageJSON = JSON.parse(message);
        var operation = messageJSON["notification"];
        if (operation.toString().localeCompare("save") == 0) {
            //call get graph and display new graph
        } else if (operation.toString().localeCompare("delete") == 0) {
            //undisplay the graph
        } else if (operation.toString().localeCompare("rename") == 0) {
            //call get graph under the new graph name
        }
    });
  });

  return client;
}