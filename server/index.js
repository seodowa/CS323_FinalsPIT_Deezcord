require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// 1. Import our separated modules
const supabase = require('./config/supabaseClient');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 2. Tell Express to use the routes we separated
// This automatically prefixes all routes in that file with "/rooms"
app.use('/rooms', roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// 3. Socket logic stays here (it uses the imported supabase client)
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (room_id) => {
    socket.join(room_id);
    console.log(`User joined room: ${room_id}`);
  });

  socket.on('send_message', async (data) => {
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        room_id: data.room_id, 
        username: data.username, 
        content: data.content 
      }]);

    if (error) {
      console.error("Error saving message:", error);
      return;
    }

    socket.to(data.room_id).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`[Deezcord Backend] Server running on port ${PORT}`);
});