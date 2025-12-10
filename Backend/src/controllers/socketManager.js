import { Server, Socket } from "socket.io";

// Store all active connections organized by meeting room path
let connections = {};

// Store chat messages for each room
let messages = {};

// Track when each user came online
let timeOnline = {};

// Initialize Socket.IO server with the HTTP server
const conectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (for development). In production, specify your frontend URL
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Listen for new client connections to the WebSocket server
  io.on("connection", (socket) => {
    // Handle when a user joins a specific call/meeting room
    socket.on("join-call", (path) => {
      // If this is the first user in this room, initialize an empty array
      if (connections[path] === undefined) {
        connections[path] = [];
      }

      // Add this user's socket ID to the room
      connections[path].push(socket.id);

      // Record the time this user joined
      timeOnline[socket.id] = new Date();

      // Notify all users in this room that a new user has joined
      for (let i = 0; i < connections[path].length; i++) {
        io.to(connections[path][i]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }

      // Check if there are any old messages for this room
      if (messages[path] !== undefined) {
        // Loop through all previous messages
        for (let a = 0; a < messages[path].length; ++a) {
          // Send each old message to the new user
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"], // The message text
            messages[path][a]["sender"], // Who sent it (name)
            messages[path][a]["socket-id-sender"] // Their socket ID
          );
        }
      }
    });

    // Handle WebRTC signaling messages (for video/audio streaming)
    socket.on("signal", (toId, messages) => {
      // Forward the signal to the intended recipient
      io.to(toId).emit("signal", socket.id, messages);
    });

    // Handle chat messages sent in the meeting
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );
      if(found == true){
        if (messages[matchingRoom] == undefined) {
          messages[matchingRoom] = []
        }
        messages[matchingRoom].push({
          "sender": sender,
          "data": data,
          "socket-id-sender": socket.id,
        })
        console.log("message", matchingRoom, ":", sender, data)
        connections[matchingRoom].forEach((element) => {
          io.to(element).emit("chat-message", data, sender, socket.id)
        });
      }
    });

    // Handle when a user disconnects from the call
    socket.on("disconnect", () => {
      if (timeOnline[socket.id]) {
        const diffTime = Math.abs(new Date() - timeOnline[socket.id]);
        console.log(`User ${socket.id} was online for ${diffTime} ms`);
        delete timeOnline[socket.id];
      }
    });
  });

  return io;
};

export { conectToSocket };
