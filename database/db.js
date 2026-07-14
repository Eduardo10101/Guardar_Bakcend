const mysql = require('mysql2');

const conexao = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.PORT,


    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,


    enableKeepAlive: true,

    keepAliveInitialDelay: 0

});


conexao.on('connection', function (connection) {

    console.log('Nova conexão MySQL criada');

});


module.exports = conexao.promise();