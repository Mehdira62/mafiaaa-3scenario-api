const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.createGame);
router.get('/:gameId', gameController.getGameByGameId);
router.get('/:gameId/player/:playerNumber/role', gameController.getPlayerRole);
router.get('/role/:qrId', gameController.getRoleByQrId);  // نمایش نقش با qrId ثابت
router.get('/', (req, res) => {
  res.send('API is working');
});

module.exports = router;
