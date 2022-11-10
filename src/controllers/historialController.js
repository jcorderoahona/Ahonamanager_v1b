const { response } = require("express");
const conn = require("../../database/conexion");

module.exports = {
    index:function(req, res){
        if(req.session.value != "Admin"){
            conn.query('select * from orden where DesdeCliente = ?',[req.session.value],(err, results) => {
                if(err) console.error(err);
                console.log(results);
                
                res.render('historial',{
                    cliente: req.session.value,
                    records: results,
                })
            })
        }
        conn.query('select * from orden ',(err, results) => {
            if(err) console.error(err);
            //console.log(results);
            res.render('historial',{
                cliente: req.session.value,
                records: results,
            })
        })
    },

    search:function(req, res){
        const id = req.query.busqueda
        
        if(((id.split(' ')).length) === 1 ){
            conn.query('select * from orden where idorden = ?',[id],(err, results) => {
                res.render('historial',{
                    cliente: req.session.value,
                    records: results,
                })
            })
        }
        else{
            conn.query('select * from orden where cliente = ?',[id],(err, results) => {
                res.render('historial',{
                    cliente: req.session.value,
                    records: results,
                })
            })
        }
        
    },
};