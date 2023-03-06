const http = require("http");
const io = require("socket.io");

const apiServer = require("./api");
const httpServer = http.createServer(apiServer);
const socketServer = io(httpServer);
const sockets = require("./socket");

const PORT = 3000;

httpServer.listen(PORT);
console.log(`Listening to The Port ${PORT}`);

sockets.listen(socketServer);