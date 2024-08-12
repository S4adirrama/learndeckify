const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const geminiRoutes = require('./routes/geminiRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/gemini', geminiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
