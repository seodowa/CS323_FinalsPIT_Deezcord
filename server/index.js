require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// 1. Import our separated modules
const supabase = require('./config/supabaseClient');
const roomRoutes = require('./routes/roomRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 2. Tell Express to use the routes we separated
app.use('/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/rooms', roomRoutes);

// Redirect root to /rooms
app.get('/', (req, res) => {
  res.redirect('/rooms');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// 3. Socket.io Authentication Middleware (The Bouncer)
io.use(async (socket, next) => {
  try {
    // The frontend must pass the token when initializing the socket connection
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new Error("Unauthorized: Invalid token"));
    }

    // Attach the verified user object to the socket for future use
    socket.user = user;
    next(); // Allow the connection to proceed
  } catch (error) {
    console.error("Socket Authentication Error:", error);
    next(new Error("Internal Server Error"));
  }
  
});


// 4. Socket logic stays here (now fully protected)
io.on('connection', (socket) => {
  // We now know exactly who this is!
  console.log(`Verified User Connected: ${socket.user.email} (Socket ID: ${socket.id})`);

  socket.on('join_room', async (room_id) => {
    try {
      // check if room_id is a string
      if (typeof room_id !== 'string') {
        throw new Error("Invalid room_id: Must be of type string");
      }

      // check if room exists in the database
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', room_id)
        .single();
      
      if (error || !room) {
        throw new Error("Room not found");
      }

      socket.join(room_id);
      console.log(`User ${socket.user.email} joined room: ${room_id}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
    
  });

  socket.on('send_message', async (data) => {
    try {
      const email = socket.user.email;
      const senderName = email ? email.split('@')[0] : "Unknown User"; 

      // type check for data.room_id
      if (typeof data.room_id !== 'string' || typeof data.content !== 'string') {
        throw new Error("Invalid room_id or content: Must be of type string");
      }

      const { error } = await supabase
        .from('messages')
        .insert([{ 
          room_id: data.room_id, 
          username: senderName, // Securely assigned
          content: data.content 
        }]);

      if (error) throw error;

      // Broadcast the message with the verified sender name attached
      const broadcastData = {
          ...data,
          username: senderName 
      };

      socket.to(data.room_id).emit('receive_message', broadcastData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.user.email}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`[Deezcord Backend] Server running on port ${PORT}`);
});