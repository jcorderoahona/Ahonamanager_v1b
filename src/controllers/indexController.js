const { response } = require("express");
const conn = require("../../database/conexion");


module.exports = {
    index: function(req, res) {
        const orderCant = new Promise((resolve, reject) => {
            conn.query("SELECT count(*) as cant FROM orden where Cliente = ?",[req.session.value],(err, order) => {
                if(err) console.error(err)
                console.log(order[0].cant)
                resolve(order[0].cant)
        })
        })

        orderCant.then((order) => {
            conn.query("SELECT count(*) as cant FROM producto where Cliente = ?",[req.session.value],(err, product) => {
                if(err) console.error(err)
                res.render('index', {
                    cantOrder : order,
                    cantProduct : product[0].cant,
                    cliente: req.session.value,
                    user:req.session,
            })
        })
        })
    },
}   