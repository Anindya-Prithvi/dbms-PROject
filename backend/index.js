var mysql = require("mysql");
var dotenv = require("dotenv");
var cors = require("cors");
const { createHash } = require("crypto");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

var express = require("express");
const app = express();
const port = 3000;
const DATABASE_NAME = process.env.databasename || "msdb_190422";

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
  console.log(`validation logger, request url: ${req.url}`);
  if (
    req.cookies.accesscookie == null &&
    (req.url.match("/api/v[0-9]+/login") ||
      req.url.match("/api/v[0-9]+/managerlogin") ||
      req.url.match("/api/v[0-9]+/register") ||
      !req.url.match("/api.*"))
  ) {
    // console.log("Should issue cookie soon");
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
  // console.log(`injection cookie ${jwtcookie}`);

  if (jwtcookie != null) {
    req.username = jwt.decode(jwtcookie)["user"];
    req.PAN = jwt.decode(jwtcookie)["pan"]; //note this will be undefined for manager tokens
  }

  if (
    req.url === "/api/v1/logout" ||
    req.url === "/api/v1/login" ||
    req.url === "/api/v1/managerlogin" ||
    req.url === "/api/v1/register"
  ) {
  } else {
    console.log(`reissuing cookie given url ${req.url}`);
    res.cookie("accesscookie", jwt.sign(jwt.decode(jwtcookie), secret), {
      sameSite: process.env.sameSite || "none",
      secure: true,
      maxAge: process.env.maxAge || 60000000,
    });
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

con_user_1.query(`USE ${DATABASE_NAME}`, (err, result) => {
  if (err) throw err;
});
con_user_2.query(`USE ${DATABASE_NAME}`, (err, result) => {
  if (err) throw err;
});

app.get("/api/v1/", (req, res) => {
  console.log(req.body); //works with POST
  console.log(req.query); //works with GET
  res.send("Please do not GET api root lol");
});

app.get("/api/v1/login", (req, res) => {
  if (req.PAN != undefined && req.username != undefined) res.send("true");
  else res.send("false");
});

app.post("/api/v1/login", (req, res) => {
  let foundHash = "";
  let foundPAN = "";
  //remember body is JSON not text

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
              maxAge: process.env.maxAge || 60000000,
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

app.get("/api/v1/managerlogin", (req, res) => {
  if (req.PAN === undefined && req.username != undefined) res.send("true");
  else res.send("false");
});
// note user==empid, so req.username and user in jwt cookie shall stay consistent for managers
app.post("/api/v1/managerlogin", (req, res) => {
  let foundHash;
  try {
    con_user_1.query(
      `
        SELECT password_hash
        FROM manager
        WHERE empID='${req.body.username}';`,
      (err, result) => {
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          foundHash = result[0]["password_hash"];
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

app.post("/api/v1/register", (req, res) => {
  let rb = req.body;

  con_user_2.query(`SELECT password_hash
FROM manager
WHERE empID='${rb.empID}';`, (err, result) => {
    if (err) throw err;
    let proceed = false;
    if (result["length"] == 0) {
    } else {
      foundHash = result[0]["password_hash"];
      let givenPassHashed = createHash("sha256")
        .update(rb.employee_password)
        .digest("hex");
      if (givenPassHashed == foundHash) {
        proceed = true;
      }
      if (!proceed) {
        res.send("failed | wrong credentials of creator");
        throw Error("Galat password hai bro");
      }

      let madepasswordhashforuser = createHash("sha256")
        .update(rb.user_password)
        .digest("hex");
      con_user_2.query(`
      INSERT INTO customers values(
        '${rb.pan}',
        '${rb.customerName}',
        ${rb.address_flatno},
        '${rb.address_locality}',
        '${rb.address_state}',
        '${rb.address_country}',
        1000,
        ${rb.phone_countryCode},
        ${rb.phone_number},
        '${rb.username}',
        '${madepasswordhashforuser}'
        );`, (err, result) => {
        if (err) {
          res.send(err.message);
          // throw err;
        }
        else {
          con_user_2.query(`INSERT INTO accounttype values(null, NOW(), 'SAV', ${rb.empID}
          , 'SBIN577989', '${rb.pan}'
          );`, (err, result) => {
            if (err) {
              res.send(err.message);
            }
            else {
              res.send("Success");
            }
          })


        }

      });
    }
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
        }

        res.send(balance.toString());
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
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

  try {
    // From savings account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, savingsaccount, customers
      WHERE savingsaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
      AND savingsaccount.serialNo = transaction.fromAccserialNo
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
  try {
    // From current account transactions
    con_user_1.query(
      `SELECT txnID as transID, amount, timeOfTransaction, toAccount, fromAcccustomerId, chequeNo, debitCardNo,
      creditcardNo, ATMId, ATMCardNo 
      from transaction, currentaccount, customers
      WHERE currentaccount.customerId = customers.pancard 
      AND transaction.fromAcccustomerId = customers.pancard
      AND customers.username = '${username}'
      AND currentaccount.serialNo = transaction.fromAccserialNo
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
      AND loanaccount.serialNo = transaction.fromAccserialNo
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
      AND creditcardaccount.serialNo = transaction.fromAccserialNo
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

app.get("/api/v1/getCreditCardDetails", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `SELECT cardNo, expiryDate, customerName, CVV
      FROM customers, creditcard, creditcardaccount 
      WHERE customers.username = '${username}'
      AND creditcardaccount.customerID = customers.pancard
      AND creditcardaccount.accountNo = creditcard.creditcardAccountNo
      ;`,
      (err, result) => {
        console.log(result);
        var creditCardDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log("CVV: " + result[0]["CVV"]);
          console.log(result["length"]);
          creditCardDetails.push(result[0]["cardNo"]);
          creditCardDetails.push(result[0]["expiryDate"]);
          creditCardDetails.push(result[0]["customerName"]);
        }
        res.send(creditCardDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/getDebitCardDetails", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `SELECT cardNo, expiryDate, customerName, CVV
      FROM customers, debitcard, savingsaccount 
      WHERE customers.username = '${username}' 
      AND savingsaccount.customerID = customers.pancard
      AND savingsaccount.accountNo = debitcard.savingsAccountNo
      ;`,
      (err, result) => {
        console.log(result);
        var debitCardDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log("CVV :" + result[0]["CVV"])
          console.log(result["length"]);
          debitCardDetails.push(result[0]["cardNo"]);
          debitCardDetails.push(result[0]["expiryDate"]);
          debitCardDetails.push(result[0]["customerName"]);
        }
        res.send(debitCardDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/paymentThroughDebitCard", (req, res) => {
  let username = req.username;
  let toAccount = req.body.toAccount;
  let toAccountType = req.body.toAccountType;
  let amount = parseInt(req.body.amount);
  let PANCard = req.PAN;
  try {
    // Validating debit card
    con_user_1.query(
      `SELECT cvv, cardNo, serialNo
      FROM customers, debitcard, savingsaccount 
      WHERE customers.username = '${username}' 
      AND savingsaccount.customerID = customers.pancard
      AND savingsaccount.accountNo = debitcard.savingsAccountNo
      ;`,
      (err, result) => {
        console.log(result);
        let isCVVCorrect = false;
        let cardNo = result[0]["cardNo"];
        let serialNo = result[0]["serialNo"];
        if (err) {
          res.send(err.message);
          throw err;
        }
        if (result["length"] == 0) {
        } else {
          if (parseInt(req.body.cvv) == result[0]["cvv"]) {
            isCVVCorrect = true;
          }
        }
        let timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        let txnId = Math.floor(Math.random() * 100000000000) + 1;

        if (isCVVCorrect) {
          con_user_1.query(
            `INSERT INTO transaction VALUES(${txnId}, ${toAccount}, '${toAccountType}', "ONL", ${amount}
              , '${timestamp}', null, ${cardNo}, null, null, null, ${serialNo}, '${PANCard}');`,
            (err, result) => {
              console.log(result);

              if (err) {
                res.send(err.message);
                throw err;
              }
              if (result["length"] == 0) {
              } else {
              }
              res.send("Success");
            }
          );
        } else {
          res.send("Incorrect CVV");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/paymentThroughCreditCard", (req, res) => {
  let username = req.username;
  let toAccount = req.body.toAccount;
  let toAccountType = req.body.toAccountType;
  let amount = parseInt(req.body.amount);
  let PANCard = req.PAN;
  try {
    // Validating credit card
    con_user_1.query(
      `SELECT cvv, cardNo, serialNo
      FROM customers, creditcard, creditcardaccount 
      WHERE customers.username = '${username}' 
      AND creditcardaccount.customerID = customers.pancard
      AND creditcardaccount.accountNo = creditcard.creditCardAccountNo
      ;`,
      (err, result) => {
        console.log(result);
        let isCVVCorrect = false;
        let cardNo = result[0]["cardNo"];
        let serialNo = result[0]["serialNo"];
        if (err) {
          res.send(err.message);
          throw err;
        }
        if (result["length"] == 0) {
        } else {
          if (req.body.cvv == result[0]["cvv"]) {
            isCVVCorrect = true;
          }
        }

        let timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        let txnId = Math.floor(Math.random() * 100000000000) + 1;

        if (isCVVCorrect) {
          con_user_1.query(
            `INSERT INTO transaction VALUES(${txnId}, ${toAccount}, '${toAccountType}', "ONL", ${amount}
              , '${timestamp}', null, null, ${cardNo}, null, null, ${serialNo}, '${PANCard}');`,
            (err, result) => {
              console.log(result);

              if (err) {
                res.send(err.message);
                throw err;
              }
              if (result["length"] == 0) {
              } else {
              }
              res.send("Success");
            }
          );
        } else {
          res.send("Incorrect CVV");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/hasSavings", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      
      SELECT COUNT(*) as count
      FROM customers, savingsaccount
      WHERE customers.username = '${username}' AND savingsaccount.customerId = customers.pancard
  ;`,
      (err, result) => {
        let hasSavings = false;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          if (result[0]["count"] > 0) {
            hasSavings = true;
          }
        }

        res.send(hasSavings);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/hasLoan", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      
      SELECT COUNT(*) as count
      FROM customers, loanaccount
      WHERE customers.username = '${username}' AND loanaccount.customerId = customers.pancard
  ;`,
      (err, result) => {
        let hasLoan = false;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          if (result[0]["count"] > 0) {
            hasLoan = true;
          }
        }

        res.send(hasLoan);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/hasCurrent", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      
      SELECT COUNT(*) as count
      FROM customers, currentaccount
      WHERE customers.username = '${username}' AND currentaccount.customerId = customers.pancard
  ;`,
      (err, result) => {
        let hasCurrent = false;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          if (result[0]["count"] > 0) {
            hasCurrent = true;
          }
        }

        res.send(hasCurrent);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/hasCredit", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      
      SELECT COUNT(*) as count
      FROM customers, creditcardaccount
      WHERE customers.username = '${username}' AND creditcardaccount.customerId = customers.pancard
  ;`,
      (err, result) => {
        let hasCredit = false;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          if (result[0]["count"] > 0) {
            hasCredit = true;
          }
        }

        res.send(hasCredit);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/currentBalance", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      SELECT balance from currentaccount, customers where customers.username = "${username}" 
      AND customers.pancard = currentaccount.customerId;`,
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

app.get("/api/v1/getCreditLimit", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      SELECT creditlimit from creditcardaccount, customers where customers.username = "${username}" 
AND customers.pancard = creditcardaccount.customerId;`,
      (err, result) => {
        let creditlimit = 0;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          creditlimit = result[0]["creditlimit"];
          console.log("INNER: " + creditlimit);
        }

        res.send(creditlimit.toString());
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
  console.log("ASDASD" + customerId);
});

app.get("/api/v1/getCreditSpent", (req, res) => {
  let username = req.username;
  console.log(username);
  var customerId;

  try {
    con_user_1.query(
      `
      SELECT creditSpent from creditcardaccount, customers where customers.username = "${username}" 
AND customers.pancard = creditcardaccount.customerId;`,
      (err, result) => {
        console.log(result);
        let creditspent = 0;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          creditspent = result[0]["creditSpent"];
          console.log("INNER: " + creditspent);
        }

        res.send(creditspent.toString());
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
  console.log("ASDASD" + customerId);
});

app.get("/api/v1/displayLoanAccountDetails", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `select principal, amountDue, interestRate, billingCycle, dueDate from loanaccount, customers
      where customers.pancard = loanaccount.customerID and customers.username = "${username}";`,
      (err, result) => {
        console.log(result);
        var loanAccountDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          loanAccountDetails.push(result[0]["principal"].toString());
          loanAccountDetails.push(result[0]["amountDue"].toString());
          loanAccountDetails.push(result[0]["interestRate"].toString());
          loanAccountDetails.push(result[0]["billingCycle"].toString());
          loanAccountDetails.push(result[0]["dueDate"].toString());
        }
        res.send(loanAccountDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/getCreditCardAccountNo", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `select accountNo, serialNo from creditcardaccount, customers
      where customers.pancard = creditcardaccount.customerID and customers.username = "${username}";`,
      (err, result) => {
        console.log(result);
        var AccountDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          AccountDetails.push(result[0]["accountNo"].toString());
          AccountDetails.push(result[0]["serialNo"].toString());
        }
        res.send(AccountDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/getLoanAccountNo", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `select accountNo, serialNo from loanaccount, customers
      where customers.pancard = loanaccount.customerID and customers.username = "${username}";`,
      (err, result) => {
        console.log(result);
        var AccountDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          AccountDetails.push(result[0]["accountNo"].toString());
          AccountDetails.push(result[0]["serialNo"].toString());
        }
        res.send(AccountDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/getSavingsAccountNo", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `select accountNo, serialNo from savingsaccount, customers
      where customers.pancard = savingsaccount.customerID and customers.username = "${username}";`,
      (err, result) => {
        console.log(result);
        var AccountDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          AccountDetails.push(result[0]["accountNo"].toString());
          AccountDetails.push(result[0]["serialNo"].toString());
        }
        res.send(AccountDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/getCurrentAccountNo", (req, res) => {
  let username = req.username;
  console.log(`hello ${username}`);
  try {
    // From credit card account transactions
    con_user_1.query(
      `select accountNo, serialNo from currentaccount, customers
      where customers.pancard = currentaccount.customerID and customers.username = "${username}";`,
      (err, result) => {
        console.log(result);
        var AccountDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          AccountDetails.push(result[0]["accountNo"].toString());
          AccountDetails.push(result[0]["serialNo"].toString());
        }
        res.send(AccountDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/SavingsACtransfer", (req, res) => {
  let username = req.username;
  let toAccNo = parseInt(req.body.toAccNo);
  let toAccType = req.body.toAccType;
  let PANCard = req.PAN;
  let amount = parseInt(req.body.amount);
  try {
    // Validating credit card
    con_user_1.query(
      `SELECT serialNo from customers, savingsaccount where
      customers.username = '${username}'
      and savingsaccount.customerId = '${PANCard}'
      ;`,
      (err, result) => {
        if (err) throw err;
        console.log(result);
        let ispassCorrect = false;
        let serialNo = result[0]["serialNo"];

        let timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        let txnId = Math.floor(Math.random() * 100000000000) + 1;

        con_user_1.query(
          `INSERT INTO transaction VALUES(${txnId}, ${toAccNo}, '${toAccType}', "ONL", ${amount}, '${timestamp}', null, null, null, null, null, ${serialNo}, '${PANCard}');`,
          (err, result) => {
            if (err) {
              res.send(err.message);
              throw err;
            } else {
              if (result["length"] == 0) {
                console.log("This shall never happen lol");
              } else {
              }
              res.send("Success");
            }
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/CurrentACtransfer", (req, res) => {
  let username = req.username;
  let toAccNo = parseInt(req.body.toAccNo);
  let toAccType = req.body.toAccType;
  let PANCard = req.PAN;
  let amount = parseInt(req.body.amount);
  try {
    // Validating credit card
    con_user_1.query(
      `SELECT serialNo from customers, currentaccount where
      customers.username = '${username}'
      and currentaccount.customerId = '${PANCard}'
      ;`,
      (err, result) => {
        if (err) throw err;
        console.log(result);
        let ispassCorrect = false;
        let serialNo = result[0]["serialNo"];

        let timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        let txnId = Math.floor(Math.random() * 100000000000) + 1;

        con_user_1.query(
          `INSERT INTO transaction VALUES(${txnId}, ${toAccNo}, '${toAccType}', "ONL", ${amount}, '${timestamp}', null, null, null, null, null, ${serialNo}, '${PANCard}');`,
          (err, result) => {
            if (err) {
              res.send(err.message);
              throw err;
            } else {
              if (result["length"] == 0) {
                console.log("This shall never happen lol");
              } else {
              }
              res.send("Success");
            }
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/CreditACtransfer", (req, res) => {
  let username = req.username;
  let toAccNo = parseInt(req.body.toAccNo);
  let toAccType = req.body.toAccType;
  let PANCard = req.PAN;
  let amount = parseInt(req.body.amount);
  try {
    // Validating credit card
    con_user_1.query(
      `SELECT serialNo from customers, creditcardaccount where
      customers.username = '${username}'
      and creditcardaccount.customerId = '${PANCard}'
      ;`,
      (err, result) => {
        if (err) throw err;
        console.log(result);
        let ispassCorrect = false;
        let serialNo = result[0]["serialNo"];

        let timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        let txnId = Math.floor(Math.random() * 100000000000) + 1;

        con_user_1.query(
          `INSERT INTO transaction VALUES(${txnId}, ${toAccNo}, '${toAccType}', "ONL", ${amount}, '${timestamp}', null, null, null, null, null, ${serialNo}, '${PANCard}');`,
          (err, result) => {
            if (err) {
              res.send(err.message);
              throw err;
            } else {
              if (result["length"] == 0) {
                console.log("This shall never happen lol");
              } else {
              }
              res.send("Success");
            }
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/allSavingsAccountTransactionsForManager", (req, res) => {
  try {
    // From savings account transactions
    con_user_2.query(
      `select * from allsavingsaccounttransactions;`,
      (err, result) => {
        console.log(result);
        var transactionDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          for (let i = 0; i < result["length"]; i++) {
            var transaction = [];
            transaction.push(result[i]["txnId"].toString());
            transaction.push(result[i]["customerId"].toString());
            transaction.push(result[i]["amount"].toString());
            transaction.push(result[i]["timeOfTransaction"].toString());
            if (!(String(result[i]["toAccount"]) === "null")) {
              transaction.push(result[i]["toAccount"].toString());
            } else {
              transaction.push(" ");
            }
            transaction.push(result[i]["accountNo"].toString());
            transaction.push(result[i]["creditOrDebit"].toString());
            transactionDetails.push(transaction);
          }
        }
        res.send(transactionDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/allLoanAccountTransactionsForManager", (req, res) => {
  try {
    // From savings account transactions
    con_user_2.query(
      `select * from allloanaccounttransactions;`,
      (err, result) => {
        console.log(result);
        var transactionDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          for (let i = 0; i < result["length"]; i++) {
            var transaction = [];
            transaction.push(result[i]["txnId"].toString());
            transaction.push(result[i]["customerId"].toString());
            transaction.push(result[i]["amount"].toString());
            transaction.push(result[i]["timeOfTransaction"].toString());
            if (!(String(result[i]["toAccount"]) === "null")) {
              transaction.push(result[i]["toAccount"].toString());
            } else {
              transaction.push(" ");
            }
            transaction.push(result[i]["accountNo"].toString());
            transaction.push(result[i]["creditOrDebit"].toString());
            transactionDetails.push(transaction);
          }
        }
        res.send(transactionDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/allCurrentAccountTransactionsForManager", (req, res) => {
  try {
    // From savings account transactions
    con_user_2.query(
      `select * from allcurrentaccounttransactions;`,
      (err, result) => {
        console.log(result);
        var transactionDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          for (let i = 0; i < result["length"]; i++) {
            var transaction = [];
            transaction.push(result[i]["txnId"].toString());
            transaction.push(result[i]["customerId"].toString());
            transaction.push(result[i]["amount"].toString());
            transaction.push(result[i]["timeOfTransaction"].toString());
            if (!(String(result[i]["toAccount"]) === "null")) {
              transaction.push(result[i]["toAccount"].toString());
            } else {
              transaction.push(" ");
            }
            transaction.push(result[i]["accountNo"].toString());
            transaction.push(result[i]["creditOrDebit"].toString());
            transactionDetails.push(transaction);
          }
        }
        res.send(transactionDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/allCreditCardAccountTransactionsForManager", (req, res) => {
  try {
    // From savings account transactions
    con_user_2.query(
      `select * from allcreditcardaccounttransactions;`,
      (err, result) => {
        console.log(result);
        var transactionDetails = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          console.log(result["length"]);
          for (let i = 0; i < result["length"]; i++) {
            var transaction = [];
            transaction.push(result[i]["txnId"].toString());
            transaction.push(result[i]["customerId"].toString());
            transaction.push(result[i]["amount"].toString());
            transaction.push(result[i]["timeOfTransaction"].toString());
            if (!(String(result[i]["toAccount"]) === "null")) {
              transaction.push(result[i]["toAccount"].toString());
            } else {
              transaction.push(" ");
            }
            transaction.push(result[i]["accountNo"].toString());
            transaction.push(result[i]["creditOrDebit"].toString());
            transactionDetails.push(transaction);
          }
        }
        res.send(transactionDetails);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/orderSavingsByBalance", (req, res) => {
  try {
    con_user_2.query(
      `
      select accountNo, customerId, balance,
dense_rank () over (order by balance desc)
as max_balance_rank 
from savingsaccount
order by max_balance_rank limit 100;`,
      (err, result) => {
        console.log(result);
        let detailsOfAccounts = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          for (let i = 0; i < result["length"]; i++) {
            let acc = [];
            acc.push(result[i]["accountNo"].toString());
            acc.push(result[i]["customerId"].toString());
            acc.push(result[i]["balance"].toString());
            acc.push(result[i]["max_balance_rank"].toString());
            detailsOfAccounts.push(acc);
          }
        }

        res.send(detailsOfAccounts);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/orderLoanByAmountDue", (req, res) => {
  try {
    con_user_2.query(
      `
      select accountNo, customerId, amountDue,
dense_rank () over (order by amountDue desc)
as max_amount_due
from loanaccount
order by max_amount_due limit 100;`,
      (err, result) => {
        console.log(result);
        let detailsOfAccounts = [];
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          for (let i = 0; i < result["length"]; i++) {
            let acc = [];
            acc.push(result[i]["accountNo"].toString());
            acc.push(result[i]["customerId"].toString());
            acc.push(result[i]["amountDue"].toString());
            acc.push(result[i]["max_amount_due"].toString());
            detailsOfAccounts.push(acc);
          }
        }

        res.send(detailsOfAccounts);
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.get("/api/v1/getCreditAmountDue", (req, res) => {
  let username = req.username;
  console.log(username);

  try {
    con_user_1.query(
      `
      SELECT amountDue from creditcardaccount, customers where customers.username = "${username}" 
AND customers.pancard = creditcardaccount.customerId;`,
      (err, result) => {
        let amountDue = 0;
        if (err) throw err;
        if (result["length"] == 0) {
        } else {
          amountDue = result[0]["amountDue"];
        }

        res.send(amountDue.toString());
      }
    );
  } catch (error) {
    console.log("someone sent a faulty req");
    res.status(404);
  }
});

app.listen(process.env.PORT || port);
