import io from "socket.io-client";

export default function getSocketClient(port) {
  let address = window.location.protocol+'//'+window.location.hostname+':'+port;

  return io(address);
}