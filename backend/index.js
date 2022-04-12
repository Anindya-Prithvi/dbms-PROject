var mysql = require('mysql');
var dotenv = require('dotenv');

var express = require('express');
const app = express();

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: dotenv.config().parsed.DB_USER,
    password: dotenv.config().parsed.DB_PASSWORD,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



