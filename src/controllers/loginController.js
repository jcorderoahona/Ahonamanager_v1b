const { response } = require("express");
const conn = require("../../database/conexion");
const userModel = require("../models/user");

module.exports = {

    index: function (req, res){
        if(req.session.id || req.session.value != null){
            req.session.destroy();
        }
        res.render('login')
    },

    login: async function (req, res) {
        const {nombre , password} = req.body;
        const values = await userModel.FindUser(nombre);
    
        if (!values) {
            res.render('login',{
                errorMessage: 'Usuario no encontrado',
            })
        }
        
        const checkpassword = userModel.checkpassword(values.Password, password);
        

        if(checkpassword){
            req.session.number = values.ID_Usuario
            req.session.value = values.Cliente
            res.redirect("/home")
            
        }
        else{
            res.render('login',{
                errorMessage: 'Contraseña incorrecta',
            })
        }
        
            
    },
    session: function(req, res) {
        console.log(req.session)
    }
    ,
    logout: function(req, res){
        if(req.session.id || req.session.value != null){
            req.session.destroy();
        }
        res.render('login')
    },
}