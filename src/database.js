const mysql = require('mysql');
const { promisify } = require('util');
// es declarar una variable constante  es son las que no cambian no se puede poner otro valor 
// require es llamra a un modulo  le estamos dicendo que  requerimos del archivo keys como lo llamamos con llaves es la destructuracion de objetos 
const { database } = require('./keys');

// creamos la conexion le pasamos el objeto databs que es el que contiene todo 
const pool = mysql.createPool(database);
//lo de pool.getconnection es una promesa 
pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                console.error('DATABASE CONNECTION WAS CLASED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('CONEXION EXITOSA');
    return;
});
pool.query = promisify(pool.query);

module.exports = pool;