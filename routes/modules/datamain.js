var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql  = require('mysql');

function connectDatabase(){
        var connection = mysql.createConnection({
            host: '192.168.1.101',       // 主机
            user: 'root',               // MySQL认证用户名
            password: '1',        // MySQL认证用户密码
            port: '3306',                   // 端口号
            database: 'node_api',
        });

        connection.connect(function(err){
            if(err){
                console.log('[query]-'+err);
                return;
            }
            console.log('[node_api connection connect] succeed!');
        });
        return connection;
}

function closeDatabase(connection){
        connection.end(function(err){
            if(err){ return; }
            console.log('[node_api connection end] succeed!');
        });
}

function querySql(sqlorder,callback){
    var connection = connectDatabase();
    connection.query(sqlorder,function(err,result){
        if(err){
            console.log('[node_api error select sqlorder:]'+err.message);
            return ;
        }
        closeDatabase(connection);
        callback(result);
    });
}


module.exports = router;
module.exports.querySql = querySql;
