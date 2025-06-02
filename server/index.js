require('dotenv').config();  // بارگذاری متغیرهای محیطی از فایل .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;  // گرفتن پورت از متغیر محیطی یا مقدار پیش‌فرض



// اتصال به MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// مسیر API بازی‌ها
app.use('/api', gameRoutes);

// شروع سرور
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
