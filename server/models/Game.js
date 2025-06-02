const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  number: { type: Number, required: true },     // شماره بازیکن (مثلاً 1 تا 15)
  qrId: { type: String, required: true, unique: true }, // کد QR ثابت و منحصربه‌فرد
  role: { type: String, default: null }         // نقش بازیکن
});

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },    // شناسه بازی
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  player_count: { type: Number, required: true },
  players: [playerSchema],                         // لیست بازیکنان
  rolesAssigned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
