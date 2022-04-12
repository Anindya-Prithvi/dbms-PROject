var mysql = require('mysql');
var dotenv = require('dotenv');
var express = require('express');

var con = mysql.createConnection({
    host: "localhost",
    port: 3305,
    user: dotenv.config().parsed.DB_USER,
    password: dotenv.config().parsed.DB_PASSWORD,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



