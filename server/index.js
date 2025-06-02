const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = 5000;

// اتصال به MongoDB
mongoose.connect('mongodb://localhost:27017/mafia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// مسیر api بازی‌ها
app.use('/api', gameRoutes);

// استارت سرور
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
