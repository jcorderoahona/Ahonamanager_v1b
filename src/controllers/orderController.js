const { response } = require("express");
const conn = require("../../database/conexion");
const cart = require("../models/cart");
const PDF = require("../models/reporte");
const path = require("path")


module.exports = {
    index:function(req, res) {
        conn.query('select DISTINCT Nombre from cliente order by Nombre ASC', function(err, result){
            if(err) console.log(err);
            res.render("order",{
                cliente : result,
                cart:cart.deleteCart(),
                sesion: req.session.value,
            });
        });
    },
    cart:function(req, res){
        const addedProduct = req.body.IdProducto
        const qty = parseInt(req.body.qty)
        const price = parseInt(req.body.Precio)
        const discount = parseInt(req.body.Descuento)
        var clientresult ={};
        conn.query('select DISTINCT Nombre from cliente order by Nombre ASC', function(err, result){
            if(err) console.log(err);
            clientresult = result;
        });
        conn.query('Select *,Sum(Cantidad) as cont from producto where Codigo = ? and Cliente = ? ',[addedProduct,req.session.value],(err,product) =>{
            if(err) console.log(err);
            
            if(product[0].ID == null){ 
                let cart1 = cart.getCart();
                if(cart1 === null){
                    cart1 = undefined;
                }
                res.render("order", {
                    cliente: clientresult,  
                    cart: cart1,
                    errorMessage: ('No existe el Codigo ' + addedProduct),
                    sesion: req.session.value,
                });
            }
            if(product[0].cont >= qty){
                cart.save(product[0],qty,price,discount);
                //console.log(cart.getCart());
                res.render("order",{
                    cart: cart.getCart(),
                    cliente : clientresult,
                    sesion: req.session.value,
                })
            }
            if(product[0].cont < qty){
                let cart1 = cart.getCart();
                if(cart1 === null){
                    cart1 = undefined;
                }
                res.render("order", {
                    cliente: clientresult,  
                    cart: cart1,
                    errorMessage: ('Solo hay ' + product[0].cont + ' unidades de ' + product[0].Nombre),
                    sesion: req.session.value,
                });
            }
            
        });
        
    },
    cartDisplay:function(req, res){
        res.render("order",{
            cart: cart.getCart(),
            sesion: req.session.value,
        })
    },

    delete:function(req, res){
        const productid = req.body.productId;
        cart.deleteProduct(productid)
        conn.query('select DISTINCT Nombre from cliente order by Nombre ASC', function(err, result){
            if(err) console.log(err);
            res.render('order',{
                cart: cart.getCart(),
                cliente: result,
                sesion: req.session.value,
            })
        });
       //res.redirect("/product")
    },

    dropdown:function(req, res){
        var type = req.query.type;
        var search = req.query.parentelement;
        if(type ==  'load_address'){
            conn.query('Select direccion from cliente where nombre = ?',[search],(err,results)=>{
                var data = [];
                results.forEach(function(row){
                    data.push(row.direccion);
                });
                res.json(data);
            })
        }
    },

    report:function(req, res){
        const clientName = req.body.clienteNombre;
        const clientAddress = req.body.direccion;
        var cart1 = cart.getCart();
        var productDetail = [];
        console.log(cart1);
        for (var i = 0; i < cart1.product.length; i++) {
            const qty = cart1.product[i].qty;
            const price = cart1.product[i].price;
            const discount = cart1.product[i].discount;
            conn.query('Select * from producto where Codigo = ? and Cliente = ? and Cantidad > 0',[cart1.product[i].id,req.session.value],(err, results) => {// tomar los datos de los productos en el carrito
                if(err) console.log(err);
                //console.log("qty",qty)
                //console.log("result",results[0])
                //if(results.length > 1) { // mas de 1 
                    var cantTotal = 0;
                    for (var j = 0; j < results.length && cantTotal != qty; j++){ 
                        // se recorren los productos
                        results[j].Precio = price
                        results[j].Descuento = discount
                        
                        if(results[j].Cantidad + cantTotal >= qty ){// se verifica la cantidad actual y si satisface la cantidad del carrito se agrega y termina el for 
                            console.log(req.session.value)
                            console.log(results[j].Codigo)
                            console.log(results[j].Lote)
                            if(results[j].Lote == null){
                                conn.query('update producto set Cantidad = ? where Codigo = ? and Lote is null and Cliente = ?',[results[j].Cantidad - (qty-cantTotal),results[j].Codigo,req.session.value],(err, resultado) =>{
                                    if(err) console.log(err);
                                    console.log(resultado);
                                });
                                results[j].Cantidad = qty - cantTotal;
                                var cantTotal = 0;
                                productDetail.push(results[j]);
                                break;
                            }
                            else{
                                conn.query('update producto set Cantidad = ? where Codigo = ? and Lote = ? and Cliente = ?',[results[j].Cantidad - (qty-cantTotal),results[j].Codigo,results[j].Lote,req.session.value],(err, resultado) =>{
                                    if(err) console.log(err);
                                    console.log(resultado);
                                });
                                results[j].Cantidad = qty - cantTotal;
                                var cantTotal = 0;
                                productDetail.push(results[j]);
                                break;
                            }
                            
                        }
                        if(results[j].Cantidad + cantTotal < qty){// se agrega al arreglo, para buscar otro producto 
                            conn.query('update producto set Cantidad = ? where Codigo = ? and Lote = ? and Cliente = ?',[0,results[j].Codigo,results[j].Lote,req.session.value],(err, result) =>{
                                if(err) console.log(err);
                                //console.log(result);
                            });
                            productDetail.push(results[j]);
                            cantTotal += results[j].Cantidad;
                        }
                    }
            })
        }
        
        var clientInfo = {};
        //se toman los datos de los clientes y se da el arreglo de los productos
        const pdf = new Promise(function(resolve, reject) {
            conn.query('select * from cliente where Nombre = ? and Direccion = ?',[clientName,clientAddress],(err, results) => {
                if(err) console.log(err);
                clientInfo = results[0];  
                resolve(PDF.buildPDF(clientInfo,productDetail,req.session.value))
            })
        })
        pdf.then(function(result){
            res.render("order",{
                cart: cart.getCart(),
                order: result,
                sesion: req.session.value,
            }
            )
        })
    },
    
};