const Game = require('../models/Game');
const Scenario = require('../models/Scenario');
const { nanoid } = require('nanoid');

// ایجاد بازی جدید با تولید QR ثابت برای هر بازیکن
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

    // ایجاد آرایه بازیکنان با شماره و qrId یکتا
    const players = [];
    for (let i = 0; i < player_count; i++) {
      players.push({
        number: i + 1,
        qrId: nanoid(10),  // تولید QR ثابت یکتا برای هر بازیکن
        role: selected_roles[i]
      });
    }

    const newGame = new Game({
      gameId: game_id,
      scenarioId: scenario._id,
      player_count,
      players,
      rolesAssigned: true,
      createdAt: new Date()
    });

    await newGame.save();

    res.json({ gameId: game_id, qrPlayers: players.map(p => ({ number: p.number, qrId: p.qrId })) });
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).json({ error: 'خطا در ایجاد بازی' });
  }
};

// دریافت اطلاعات بازی بر اساس gameId
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
      players: game.players,
      rolesAssigned: game.rolesAssigned,
      createdAt: game.createdAt
    });
  } catch (err) {
    console.error("Error getting game:", err);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات بازی' });
  }
};

// دریافت نقش بازیکن بر اساس شماره بازیکن
exports.getPlayerRole = async (req, res) => {
  const { gameId, playerNumber } = req.params;

  try {
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ error: 'بازی یافت نشد' });
    }

    const index = parseInt(playerNumber) - 1;
    if (index < 0 || index >= game.players.length) {
      return res.status(400).json({ error: 'شماره بازیکن نامعتبر است' });
    }

    const player = game.players[index];

    res.json({ playerNumber, role: player.role });
  } catch (err) {
    console.error("Error getting player role:", err);
    res.status(500).json({ error: 'خطا در دریافت نقش بازیکن' });
  }
};

// دریافت نقش بازیکن با استفاده از qrId ثابت
exports.getRoleByQrId = async (req, res) => {
  const { qrId } = req.params;

  try {
    // جستجو بازی‌ای که بازیکنی با این qrId دارد
    const game = await Game.findOne({ 'players.qrId': qrId });

    if (!game) {
      return res.status(404).json({ error: 'بازی یا بازیکن یافت نشد' });
    }

    // پیدا کردن بازیکن مورد نظر
    const player = game.players.find(p => p.qrId === qrId);

    if (!player) {
      return res.status(404).json({ error: 'بازیکن یافت نشد' });
    }

    res.json({
      playerNumber: player.number,
      role: player.role || 'هنوز نقشی اختصاص داده نشده'
    });

  } catch (err) {
    console.error("Error getting role by qrId:", err);
    res.status(500).json({ error: 'خطا در دریافت نقش بازیکن' });
  }
};
