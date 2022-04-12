var mysql = require('mysql');
var dotenv = require('dotenv');

var express = require('express');
const app = express();
const port = 3000;
const DATABASE_NAME = "BDSM";

var con_user_1 = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: dotenv.config().parsed.DB_USER_1,
    password: dotenv.config().parsed.DB_PASSWORD_1,
});

con_user_1.connect(function (err) {
    if (err) throw err;
    console.log("Connected with privilege 1!");
});

var con_user_2 = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: dotenv.config().parsed.DB_USER_2,
    password: dotenv.config().parsed.DB_PASSWORD_2,
});

con_user_2.connect(function (err) {
    if (err) throw err;
    console.log("Connected with privilege 2!");
});

con_user_1.query(`USE ${DATABASE_NAME}`);
con_user_2.query(`USE ${DATABASE_NAME}`);

app.get('/', (req, res) => {
    console.log(req.body); //works with POST
    console.log(req.query); //works with GET 
    res.send("Do not ping root lol");
})

app.get('/register', (req, res) => {
    con_user_1.query(`SELECT 1`, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
    res.send('Working');
})

app.post('/register', (req, res) => {
    con_user_1.query(`-- INSERT INTO ${req.body}`, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log("posting");
        res.send("Registered!!");
    })
})

app.listen(process.env.PORT || port);