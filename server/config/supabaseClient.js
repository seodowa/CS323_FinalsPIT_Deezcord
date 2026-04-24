require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the Service Role Key to bypass RLS securely from your trusted backend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;