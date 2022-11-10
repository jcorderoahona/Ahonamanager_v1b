const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController')

router.get('/', loginController.index)
router.post('/signin', loginController.login)
router.post('/test', loginController.session)
router.get('/logout',loginController.logout)
module.exports = router;