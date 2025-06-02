const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roles: [{ type: String, required: true }]  // لیست نقش‌ها در این سناریو
});

module.exports = mongoose.model('Scenario', scenarioSchema);
