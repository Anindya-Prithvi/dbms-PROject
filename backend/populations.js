var mysql = require('mysql');
var fs = require('fs');

const DATABASE_NAME = "msdb_190422";

var con_user_1 = mysql.createConnection({
    host: "db4free.net",
    port: 3306,
    user: 'user1_lol1', //SEND TO SECRETS
    password: 'password',
    multipleStatements: true
});

con_user_1.connect(function (err) {
    if (err) throw err;
    console.log("Connected with privilege 1!");
});

con_user_1.query(`USE ${DATABASE_NAME}`);

const fullscript = fs.readFileSync('../population_control/data/tryjection.sql', { encoding: 'utf-8' });

con_user_1.query(`${fullscript}`, (err, result) => { console.log(result) });
