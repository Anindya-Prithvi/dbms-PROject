var mysql = require('mysql');
var dotenv = require('dotenv');
var cors = require('cors');
const { createHash } = require('crypto');

var express = require('express');
const app = express();
const port = 3000;
const DATABASE_NAME = "BDSM";

app.use(cors()); //#TODO:remove in production
app.use(express.json());
app.use(express.urlencoded());

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

app.post('/login', (req, res) => {
    let foundHash = '';

    try {
        con_user_1.query(`
        SELECT passwordHash
        FROM customers
        WHERE username='${req.body.username}';`,
            (err, result) => {
                if (err) throw err;
                if (result['length'] == 0) { }
                else {
                    foundHash = (result[0]['passwordHash']);
                }
                //send tokens here
                // console.log(foundHash);
                if (foundHash == '') res.send('');
                else {
                    let givenPassHashed = createHash('sha256').update(req.body.password).digest('hex');
                    if (givenPassHashed == foundHash) {
                        res.send("YAYYYY");
                    }
                    else {
                        res.send('');
                    }
                }
            });
    } catch (error) {
        console.log("someone sent a faulty req");
        res.status(404);
    }

});

app.get('/register', (req, res) => {
    con_user_1.query(`SELECT 1`, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
    res.send('Working');
});

app.post('/register', (req, res) => {
    con_user_1.query(`-- INSERT INTO ${req.body}`, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log("posting");
        res.send("Registered!!");
    });
});

app.listen(process.env.PORT || port);
