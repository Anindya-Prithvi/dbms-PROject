var mysql = require("mysql");
var cors = require("cors");
const { createHash } = require("crypto");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

var express = require("express");
const app = express();
const port = 3000;
const DATABASE_NAME = "BDSM";

app.use(
    cors({
        origin: ["http://localhost:4200", "https://anindya-prithvi.github.io"],
        credentials: true,
    })
); //#TODO:remove in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const secret = process.env.secret;

var con_user_1 = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER_1,
    password: process.env.DB_PASSWORD_1,
});

con_user_1.connect(function (err) {
    if (err) throw err;
    console.log("Connected with privilege 1!");
});

var con_user_2 = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER_2,
    password: process.env.DB_PASSWORD_2,
});

con_user_2.connect(function (err) {
    if (err) throw err;
    console.log("Connected with privilege 2!");
});

con_user_1.query(`USE ${DATABASE_NAME}`);
con_user_2.query(`USE ${DATABASE_NAME}`);

app.get("/", (req, res) => {
    console.log(req.body); //works with POST
    console.log(req.query); //works with GET
    res.send("Please do not ping root lol");
});

app.post("/login", (req, res) => {
    let foundHash = "";

    try {
        con_user_1.query(
            `
        SELECT passwordHash
        FROM customers
        WHERE username='${req.body.username}';`,
            (err, result) => {
                if (err) throw err;
                if (result["length"] == 0) {
                } else {
                    foundHash = result[0]["passwordHash"];
                }
                //send tokens here
                // console.log(foundHash);
                if (foundHash == "") res.send("");
                else {
                    let givenPassHashed = createHash("sha256")
                        .update(req.body.password)
                        .digest("hex");
                    if (givenPassHashed == foundHash) {
                        let token = jwt.sign(
                            {
                                user: req.body.username,
                            },
                            secret
                        );
                        res.cookie("accesscookie", token, {
                            sameSite: "none",
                            secure: true,
                        });
                        res.send("lol");
                    } else {
                        res.send("");
                    }
                }
            }
        );
    } catch (error) {
        console.log("someone sent a faulty req");
        res.status(404);
    }
});

app.get("/register", (req, res) => {
    con_user_1.query(`SELECT 1`, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
    res.send("Working");
});

app.post("/register", (req, res) => {
    con_user_1.query(`-- INSERT INTO ${req.body}`, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log("posting");
        res.send("Registered!!");
    });
});

app.get("/savingsBalance", (req, res) => {
    let jwtcookie = req.cookies["accesscookie"];
    console.log(jwtcookie);
    console.log(jwt.decode(jwtcookie));
    let username = jwt.decode(jwtcookie)["user"];
    console.log(username);
    var customerId;
    // con_user_1.query(`SELECT 1`, (err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    // });

    try {
        con_user_1.query(
            `
        SELECT accountType.customer_id, savingsAccount.balance as balance
        FROM accountType, savingsAccount 
        WHERE EXISTS(
            SELECT *
            FROM customers
            WHERE customers.username = '${username}' AND savingsAccount.customerId = customers.pancard
        );`,
            (err, result) => {
                let balance = 0;
                if (err) throw err;
                if (result["length"] == 0) {
                } else {
                    balance = result[0]["balance"];
                    console.log("INNER: " + balance);
                }

                res.send(balance.toString());
            }
        );

        // console.log("TEST: " + test);
    } catch (error) {
        console.log("someone sent a faulty req");
        res.status(404);
    }
    console.log("ASDASD" + customerId);
});

app.get("/savingsTransaction", (req, res) => {
    let jwtcookie = req.cookies["accesscookie"];
    console.log(jwtcookie);
    console.log(jwt.decode(jwtcookie));
    let username = jwt.decode(jwtcookie)["user"];
    console.log("hello");
    try {
        // From savings account transactions
        con_user_1.query(
            `SELECT * from transaction, savingsaccount, customers
        WHERE savingsaccount.customerId = customers.pancard 
        AND transaction.fromAcccustomerId = customers.pancard
        AND customers.username = '${username}'
        ; `,
            (err, result) => {
                console.log(result);
                if (err) throw err;
                if (result["length"] == 0) {
                } else {
                    console.log(result[0]["transID"]);
                }
                res.send("hello");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.listen(process.env.PORT || port);
