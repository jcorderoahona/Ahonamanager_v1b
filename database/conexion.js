const mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'ahona'
});

conn.connect(
    (err) => {
        if (!err) {
            console.log('Connection established');
        }
        else{
            console.log('Connection failed');
        }
    }
);
module.exports = conn



