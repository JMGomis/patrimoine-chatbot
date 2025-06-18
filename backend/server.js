require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { handleGroqQuery } = require('./groq-handler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock user database
const users = {
  'user1': { age: 35, income: 75000, riskTolerance: 'moderate', goals: ['retirement', 'buy house'] },
  'user2': { age: 28, income: 50000, riskTolerance: 'aggressive', goals: ['start business'] }
};

// Middleware to get user profile
app.use((req, res, next) => {
  const userId = req.headers['user-id'] || 'guest';
  req.userProfile = users[userId] || { age: 40, income: 60000, riskTolerance: 'neutral', goals: [] };
  next();
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const response = await handleGroqQuery(message, chatHistory, req.userProfile);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});