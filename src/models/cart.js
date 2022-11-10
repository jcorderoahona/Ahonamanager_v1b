let cart = null;
const conn = require("../../database/conexion");

module.exports = class Cart{
    static save(data,qty,precio,descuento){

        if(isNaN(descuento)){
            descuento = 0;
        }
        else{
            descuento = descuento;
        }
        
        var product = {
            id:data.Codigo,
            qty:qty,
            price:precio,
            discount:descuento,
            discountprice : ((precio)-((descuento/100)*precio))
        };
        
        if (cart)  {
            const checkproductindex = cart.product.findIndex(p => p.id === data.Codigo);
            if(checkproductindex >= 0){// esta en el carrito
                const productexist = cart.product[checkproductindex];
                productexist.qty = qty;
                productexist.discount = descuento;
                productexist.price = precio;
                productexist.discountprice = ((precio)-((descuento/100)*precio));
            } 
            else{
                cart.product.push(product);
            }

        }
        else{
            cart = {
                product:[],
            };
            cart.product.push(product);
        }
    };

    static getCart(){
        return cart;
    };

    static deleteProduct(id){
        console.log(cart)
        const checkproductindex = cart.product.findIndex(p => {
            return p.id === id
        });
        if(checkproductindex >= 0){ 
            cart.product.splice(checkproductindex, 1);
        }
        if(cart.product.length == 0){
            cart = undefined;
        }
        
    }   
    static deleteCart(){
        cart = null;
        return undefined;
    }
}