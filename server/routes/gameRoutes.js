const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// مسیر تست برای اطمینان از عملکرد API
router.get('/', (req, res) => {
  res.send('API is working');
});

// سایر مسیرهای API
router.post('/', gameController.createGame);
router.get('/:gameId', gameController.getGameByGameId);
router.get('/:gameId/player/:playerNumber/role', gameController.getPlayerRole);
router.get('/role/:qrId', gameController.getRoleByQrId);

module.exports = router;
