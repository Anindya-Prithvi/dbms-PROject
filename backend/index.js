var mysql = require("mysql");
var dotenv = require("dotenv");
var cors = require("cors");
const { createHash } = require("crypto");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

var express = require("express");
const app = express();
const port = 3000;
const DATABASE_NAME = process.env.databasename || "BDSM";

process.env.staticdist ||
  app.use(
    cors({
      origin: ["http://localhost:4200", "https://anindya-prithvi.github.io"],
      credentials: true,
    })
  ); //#TODO:remove in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
process.env.staticdist || app.use(express.static("dist"));

const secret = process.env.secret || dotenv.config().parsed.secret;
function validateCookies(req, res, next) {
  console.log(req.url);
  if (
    req.cookies.accesscookie == null &&
    (req.url.match("/api/v[0-9]+/login") || !req.url.match("/api.*"))
  ) {
    console.log("Issuing cookie cookie");
    next();
  } else if (
    req.cookies.accesscookie != null &&
    jwt.verify(req.cookies.accesscookie, secret)
  ) {
    console.log("Cookie validated");
    next();
  } else throw new Error("Invalid cookies/session expired");
}

app.use(validateCookies);

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

function injectInfofromJWT(req, res, next) {
  let jwtcookie = req.cookies["accesscookie"];

  if (jwtcookie != null) {
    req.username = jwt.decode(jwtcookie)["user"];
    req.PAN = jwt.decode(jwtcookie)["pan"];
  }

  if (req.url === "/api/v1/logout" || req.url === "/api/v1/login") {
  } else {
    console.log("reissuing cookie");
    res.cookie(
      "accesscookie",
      jwt.sign(
        {
          user: req.username,
          pan: req.PAN,
        },
        secret
      ),
      {
        sameSite: process.env.sameSite || "none",
        secure: true,
        maxAge: 60000,
      }
    );
  }
  // might inject PAN here
  next();
}

app.use(injectInfofromJWT);

var con_user_1 = mysql.createConnection({
  host: process.env.host || "localhost",
  port: 3306,
  user: process.env.DB_USER_1 || dotenv.config().parsed.DB_USER_1,
  password: process.env.DB_PASSWORD_1 || dotenv.config().parsed.DB_PASSWORD_1,
});

con_user_1.connect(function (err) {
  if (err) throw err;
  console.log("Connected with privilege 1!");
});

var con_user_2 = mysql.createConnection({
  host: process.env.host || "localhost",
  port: 3306,
  user: process.env.DB_USER_2 || dotenv.config().parsed.DB_USER_2,
  password: process.env.DB_PASSWORD_2 || dotenv.config().parsed.DB_PASSWORD_2,
});

con_user_2.connect(function (err) {
  if (err) throw err;
  console.log("Connected with privilege 2!");
});

con_user_1.query(`USE ${DATABASE_NAME}`);
con_user_2.query(`USE ${DATABASE_NAME}`);

app.get("/api/v1/", (req, res) => {
  console.log(req.body); //works with POST
  console.log(req.query); //works with GET
  res.send("Please do not GET api root lol");
});

app.get("/api/v1/login", (req, res) => {
  if (req.cookies.accesscookie != null) res.send("true");
  else res.send("false");
});

app.post("/api/v1/login", (req, res) => {
  let foundHash = "";
  let foundPAN = "";

  try {
    con_user_1.query(
      `
        SELECT passwordHash, pancard
        FROM customers
        WHERE username='${req.body.username}';`,
      (err, result) => {
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          foundHash = result[0]["passwordHash"];
          foundPAN = result[0]["pancard"];
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
                pan: foundPAN,
              },
              secret
            );

            // make permanant to store??
            res.cookie("accesscookie", token, {
              sameSite: process.env.sameSite || "none",
              secure: true,
              maxAge: 60000,
            });
            res.send("correct");
          } else {
            res.send("wrong");
          }
        }
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/logout", (req, res) => {
  res.cookie("accesscookie", req.cookies["accesscookie"], {
    maxAge: 0,
    sameSite: "none",
    secure: true,
  });
  res.send("bye");
});

app.get("/api/v1/register", (req, res) => {
  con_user_1.query(`SELECT 1`, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  res.send("Working");
});

app.post("/api/v1/register", (req, res) => {
  con_user_1.query(`-- INSERT INTO ${req.body}`, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log("posting");
    res.send("Registered!!");
  });
});

app.get("/api/v1/savingsBalance", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
        SELECT accounttype.customer_id, savingsaccount.balance as balance
        FROM accounttype, savingsaccount 
        WHERE EXISTS(
            SELECT *
            FROM customers
            WHERE customers.username = '${username}' AND savingsaccount.customerId = customers.pancard
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
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
  console.log("ASDASD" + customerId);
});

function showTransactions(result) {
  var transactions = [];
  for (let i = 0; i < result["length"]; i++) {
    var transactionDetails = [];
    transactionDetails.push(result[i]["transID"].toString());
    transactionDetails.push(result[i]["amount"].toString());
    transactionDetails.push(result[i]["timeOfTransaction"].toString());
    if (!(String(result[i]["toAccount"]) === "null")) {
      transactionDetails.push(result[i]["toAccount"].toString());
    } else {
      transactionDetails.push("");
    }

    transactionDetails.push(result[i]["fromAcccustomerId"].toString());
    if (!(String(result[i]["chequeNo"]) === "null")) {
      transactionDetails.push("CHEQUE");
      transactionDetails.push(result[i]["chequeNo"].toString());
    } else if (!(String(result[i]["creditcardNo"]) === "null")) {
      transactionDetails.push("CREDIT CARD");
      transactionDetails.push(result[i]["creditcardNo"].toString());
    } else if (!(String(result[i]["ATMId"]) === "null")) {
      transactionDetails.push("ATM");
      transactionDetails.push(result[i]["ATMCardNo"].toString());
    } else if (!(String(result[i]["debitCardNo"]) === "null")) {
      transactionDetails.push("DEBIT CARD");
      transactionDetails.push(result[i]["debitCardNo"].toString());
    } else {
      transactionDetails.push("ACCOUNT TO ACCOUNT");
      transactionDetails.push("");
    }
    transactions.push(transactionDetails);
  }
  return transactions;
}

app.get("/api/v1/savingsTransaction", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From savings account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, savingsaccount, customers
      WHERE savingsaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
UNION
SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, savingsaccount, customers
      WHERE savingsaccount.customerId = customers.pancard 
      AND transaction.toAccount = savingsaccount.accountNo
      AND customers.username = '${username}'
      ; `,
      (err, result) => {
        console.log(result);
        var transactions = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          transactions = showTransactions(result);
        }
        res.send(transactions);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/currentTransaction", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From current account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, currentaccount, customers
      WHERE currentaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
UNION
SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, currentaccount, customers
      WHERE currentaccount.customerId = customers.pancard 
      AND transaction.toAccount = currentaccount.accountNo
      AND customers.username = '${username}'
      ; `,
      (err, result) => {
        console.log(result);
        var transactions = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          transactions = showTransactions(result);
        }
        res.send(transactions);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/loanTransaction", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From loan account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, loanaccount, customers
      WHERE loanaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
UNION
SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, loanaccount, customers
      WHERE loanaccount.customerId = customers.pancard 
      AND transaction.toAccount = loanaccount.accountNo
      AND customers.username = '${username}'
      ; `,
      (err, result) => {
        console.log(result);
        var transactions = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          transactions = showTransactions(result);
        }
        res.send(transactions);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/creditTransaction", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, creditcardaccount, customers
      WHERE creditcardaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
UNION
SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, creditcardaccount, customers
      WHERE creditcardaccount.customerId = customers.pancard 
      AND transaction.toAccount = creditcardaccount.accountNo
      AND customers.username = '${username}'
      ; `,
      (err, result) => {
        console.log(result);
        var transactions = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          transactions = showTransactions(result);
        }
        res.send(transactions);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/sendMoney", (req, res) => {
  let username = req.username;
  try {
    // Insert values for transactions
    
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || port);
