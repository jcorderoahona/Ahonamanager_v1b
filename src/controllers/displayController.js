const { response } = require("express");
const conn = require("../../database/conexion");



module.exports = {
    index: function(req, res) {
        if(req.session.value != "Admin"){
            conn.query('select * from producto where Cliente = ?',[req.session.value],(err, results) =>{
                if(err) console.error(err);
                res.render('display',{
                    productos:results,
                    cliente: req.session.value,
                })
            })
        }
        conn.query('select * from producto',(err, results) =>{
            if(err) console.error(err);
            res.render('display',{
                cliente: req.session.value,
                productos:results
            })
        })
    },
    stateDisplayed: function(req, res) {
        const state = req.query.state;
        const codigo = req.query.codigo;
        var direcBodega = ""
        if(state === "Aprobado"){
            direcBodega = "Bodega aprobado";
        }
        if(state === "Rechazado"){
            direcBodega = "Bodega Rechazado";
        }
        if(state === "Cuarentena"){
            direcBodega = "Bodega Cuarentena";
        }
        //console.log(state)
        //console.log(codigo)
        conn.query('update producto set Estado = ?,Bodega = ? where Codigo = ?',[state,direcBodega, codigo],(err, result) => {
            if(err) console.error(err);
            res.render("display",{
                cliente: req.session.value,
                state : true,
            })
        })
        
    },
}