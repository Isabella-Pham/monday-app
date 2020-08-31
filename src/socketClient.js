import io from "socket.io-client";
import Constants from './constants/constants';

export default function setSocketClient(workspaceRef) {
  if (Constants.SOCKET) {
      return;
  }

  let address = window.location.protocol + '//' + window.location.host;
  let client = io(address);

  client.on('connect', () => {
    console.log('WebSocket Client Connected');
  });

  client.on('error', function (error) {
      console.log("Connection Error: " + error.toString());
  });
  client.on('disconnect', function () {
      console.log('echo-protocol Connection Closed');
  });
  client.on('message', function (message) {
    try {
      const  messageJSON = JSON.parse(message);
      var operation = messageJSON["message"];
      if (operation.toString().localeCompare("init") === 0) {
          Constants.setClientId(messageJSON.id);
      } else if (operation.toString().localeCompare("new") === 0) {
          // update window.graphs, force update
          window.graphs = messageJSON.graphs;
          workspaceRef.current.forceUpdate();
      } else if (operation.toString().localeCompare("delete") === 0) {
          // update window.graphs, if current graphId = deleted graphId, reset graph, force update
          window.graphs = messageJSON.graphs;
          if (!workspaceRef.current.updateAfterDeletion(messageJSON.graphId)) {
              workspaceRef.current.forceUpdate();
          }
      } else if (operation.toString().localeCompare("update") === 0) {
          // update window.graphs, if current graphId is changed, update workspace, force update
          window.graphs = messageJSON.graphs;
          if (!workspaceRef.current.updateCurrentGraph(messageJSON.graph)) {
              workspaceRef.current.forceUpdate();
          }
      }
    } catch (e) {
        console.log("SOCKET PARSE ERROR:", e);
    }
  });

  Constants.setSocket(client);
}