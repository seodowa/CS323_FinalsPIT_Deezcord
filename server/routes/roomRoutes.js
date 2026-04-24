const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Import the DB

// GET /rooms/:roomId/messages - Fetch message history
router.get('/:roomId/messages', async (req, res) => {
  const { roomId } = req.params;
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// You can easily add more standard endpoints here later, like:
// router.post('/create', createRoomLogic...);
// router.get('/', getAllRoomsLogic...);

module.exports = router;