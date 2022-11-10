const express = require('express');
const router = express.Router();
const displayController = require('../controllers/displayController')
const conn = require("../../database/conexion");
const path = require("path")


router.get('/',displayController.index);
router.get('/get_data',displayController.stateDisplayed);

module.exports = router;
