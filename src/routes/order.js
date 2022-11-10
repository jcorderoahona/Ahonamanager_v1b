const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')
const conn = require("../../database/conexion");
const path = require("path")

router.get('/',orderController.index);
router.post('/add',orderController.cart); 
router.get('/add',orderController.cartDisplay);
//router.get('/delete',orderController.cartDisplay);
router.get('/add/get_data',orderController.dropdown);
router.post('/delete',orderController.delete);
router.post('/reporte',orderController.report);
router.get('/download/:id', function(req,res){
    res.download(path.join(__dirname + "../../../PDF/"+`test${req.params.id}.pdf`))

});

module.exports = router;



