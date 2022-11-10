const { response } = require("express")
const conn = require("../../database/conexion")


module.exports = {
    index: function(req, res) {
        res.render('addproduct',{
            cliente: req.session.value,
        })
    },

    searchproduct:function(req, res){
        const codigo = req.query.Codigosearch
        conn.query('select *  from producto where Codigo = ?',[codigo],(err, results) =>{
            const cant = results.length
            if(cant == 0){
                res.render('addproduct',{
                    cliente: req.session.value,
                    errorMessage: "Producto no encontrado",
                });
            }
            if(cant > 0){
                res.render('addproduct',{
                    cliente: req.session.value,
                    addedProduct :results,
                    cant: 0,
                });
            }
            
        })
    },

    addproduct:function(req, res){
        const cantidad = req.body.Cantidad
        const lote = req.body.Lote
        const fecha = req.body.Fecha_Ven
        const codigo = req.body.codigo
        const nombre = req.body.nombre
        conn.query('insert into producto (Codigo,Nombre,Cantidad,Lote,Fecha_Ven,Unidad_Medida,Estado,Bodega) values(?,?,?,?,?,?,?,?)',[codigo,nombre,cantidad,lote,fecha,'UN','Aprobado','Bodega Aprobado'],(err, results) => {
            if (err) console.log(err)
            console.log(results)
            res.redirect('/addproduct')
        })

    }
}