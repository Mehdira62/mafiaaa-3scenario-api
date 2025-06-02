const Game = require('../models/Game');
const Scenario = require('../models/Scenario');
const { nanoid } = require('nanoid');

// ایجاد بازی جدید
exports.createGame = async (req, res) => {
  const { scenario_id, player_count, selected_roles } = req.body;

  if (!scenario_id || !player_count || !selected_roles) {
    return res.status(400).json({ error: 'اطلاعات کامل نیستند' });
  }

  if (player_count < 10 || player_count > 15) {
    return res.status(400).json({ error: 'تعداد بازیکن باید بین 10 تا 15 باشد' });
  }

  if (selected_roles.length !== player_count) {
    return res.status(400).json({ error: 'تعداد نقش‌ها باید با تعداد بازیکن برابر باشد' });
  }

  try {
    const scenario = await Scenario.findById(scenario_id);
    if (!scenario) {
      return res.status(404).json({ error: 'سناریو یافت نشد' });
    }

    const game_id = nanoid(6);

    const newGame = new Game({
      gameId: game_id,
      scenarioId: scenario._id,
      player_count,
      selected_roles,
      rolesAssigned: false,
      createdAt: new Date()
    });

    await newGame.save();

    res.json({ gameId: game_id, qr_url: `https://yourdomain.com/game/${game_id}` });
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).json({ error: 'خطا در ایجاد بازی' });
  }
};

// دریافت بازی بر اساس gameId
exports.getGameByGameId = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findOne({ gameId }).populate('scenarioId', 'name roles');

    if (!game) {
      return res.status(404).json({ error: 'بازی یافت نشد' });
    }

    res.json({
      gameId: game.gameId,
      scenario: game.scenarioId,
      player_count: game.player_count,
      selected_roles: game.selected_roles,
      rolesAssigned: game.rolesAssigned,
      createdAt: game.createdAt
    });
  } catch (err) {
    console.error("Error getting game:", err);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات بازی' });
  }
};

// دریافت همه سناریوها
exports.getAllScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (err) {
    console.error("Error getting scenarios:", err);
    res.status(500).json({ error: 'خطا در دریافت سناریوها' });
  }
};
