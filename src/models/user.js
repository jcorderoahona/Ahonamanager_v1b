const conn = require("../../database/conexion");

module.exports ={

    FindUser:function (nombre) {
        return new Promise(function(resolve, reject){
            conn.query('select * from usuario where nombre = ? limit 1',[nombre],(err, results) => {
                if(err) console.error(err);
                resolve(results[0]);
            })
        })
    },

    checkpassword:function (userPassword, password) {
        if(userPassword == password){
            return true;
        }
        else{
            return false;
        }
    }
}