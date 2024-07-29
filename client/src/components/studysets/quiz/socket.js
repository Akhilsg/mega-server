const createWebSocketConnection = () => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket connection closed");
  });

  return { socket, isConnected: true };
};

export default createWebSocketConnection;
