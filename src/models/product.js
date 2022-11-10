module.exports ={

    clientData:function(connection,funcion){
        connection.query('select DISTINCT Nombre from cliente order by Nombre ASC',funcion);
    }

    
}