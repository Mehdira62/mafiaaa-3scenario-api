const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;  // پورت رو از متغیر محیطی می‌گیریم

// اتصال به MongoDB با متغیر محیطی (اگر تنظیم نشده، آدرس لوکال پیش‌فرض)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mafia';

mongoose.connect(mongoURI)
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
