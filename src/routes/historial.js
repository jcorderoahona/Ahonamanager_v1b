const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController.js')


router.get('/',historialController.index);
router.get('/search',historialController.search);

module.exports = router;