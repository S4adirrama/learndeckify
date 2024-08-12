const express = require('express');
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();

app.use(express.json());

// Use the Gemini routes
app.use('/api/gemini', geminiRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
