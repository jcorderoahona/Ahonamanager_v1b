const express = require('express');
const router = express.Router();
const addproductController = require('../controllers/addproductController')


router.get('/',addproductController.index);

router.get('/search',addproductController.searchproduct)
router.post('/add',addproductController.addproduct)

module.exports = router;