const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');

router.get('/', scenarioController.getAllScenarios);

module.exports = router;
