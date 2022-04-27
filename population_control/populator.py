# Population control

import random, time, secrets, hashlib, string, datetime

DATABASE_PROJECT_NAME = "msdb_190422"
initstring = f"""UNLOCK TABLES;
DROP DATABASE IF EXISTS {DATABASE_PROJECT_NAME};
CREATE DATABASE {DATABASE_PROJECT_NAME};
USE {DATABASE_PROJECT_NAME};
"""


class Customer:
    def gen_accNo():
        """We shall use current timestamp since epoch
        granularity at 1/10000s
        generated acc. number is atleast 15 digits
        """
        time.sleep(0.0001)
        return int(time.time() * 100000)

    def get_name(names: list[str]):
        """Fetched Puerto Rican name repo with 22k unique names
        Note, the more the names, the more the accounts we can make
        """
        # with open("data/PRnames","r") as f:
        #     names:list[str] = f.read().split()
        return random.choice(names)

    def make_userpass(fromname: str):
        """We make username from the real name, password from a random token
        All passwords are hashed sha256, for the purpose of logging in, I shall be saving the
        username and their corresponding passwords.
        """
        user: str = (
            fromname.lower()[:-1]
            + hex(random.SystemRandom().randint(1, 10000000)).upper()[-5:]
        )
        password: str = secrets.token_urlsafe(8)
        passwordhash: str = hashlib.sha256(bytes(password, "utf-8")).hexdigest()
        try:
            with open("data/LoginDumpUser", "a") as f:
                f.write(user + " " + password + "\n")
        except:
            print(f"Could not write: {user} {password}")
        return (user, passwordhash)

    def make_address(cities: list[str], countries: list[str], state: list[str]):
        """Ship cities as locality for now, we just have to populate"""
        return (
            random.randint(1, 999),
            random.choice(cities),
            random.choice(state),
            random.choice(countries),
        )

    def make_phone():
        return (random.randint(1, 500), random.randint(1234567890, 9999999999))

    def master_make_values(n=2000):
        # we shall iterate through all pancards as they are supposed to be primary
        values = []
        with open("data/PRnames") as f:
            names = f.read().split()
        with open("data/CityNames") as f:
            cities = f.read().split("\n")
        with open("data/CountryNames") as f:
            countries = f.read().split("\n")
        with open("data/StateNames") as f:
            states = f.read().split("\n")
        PANnumbers = set()
        for _ in range(n):
            PANnumbers.add(
                "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
                + f"{random.randint(1,9999)}".zfill(4)
                + random.choice(string.ascii_uppercase)
            )
        for pan in PANnumbers:
            # print(f"Adding user for pan: {pan}")
            creditScore: int = random.randint(1, 100)
            customerName: str = Customer.get_name(names)
            values.append(
                (
                    pan,
                    customerName,
                    *Customer.make_address(cities, countries, states),
                    creditScore,
                    *Customer.make_phone(),
                    *Customer.make_userpass(customerName),
                )
            )

        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `pancard` varchar(10) NOT NULL,
  `customerName` varchar(100) NOT NULL,
  `address_flatno` int NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  `creditScore` int DEFAULT NULL,
  `phone_countryCode` int DEFAULT NULL,
  `phone_number` decimal(10,0) DEFAULT NULL,
  `username` varchar(32) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  PRIMARY KEY (`pancard`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
INSERT INTO `customers` VALUES {values};
UNLOCK TABLES;\n
"""
        return injection


class Manager:
    """I shall only generate 1000|n managers"""

    def gen_val(n=1000):
        """Emp ID is anyways not accessible to everyone,
        so EMPID will follow an autoincrement start at 1337"""
        empIds = [1337 + i for i in range(n)]
        with open("data/PRnames") as f:
            names = f.read().split()
        random.shuffle(names)
        names = names[:n]

        values = []
        for i in range(n):
            password = secrets.token_urlsafe(8)
            try:
                with open("data/LoginDumpManager", "a") as f:
                    f.write(f"{empIds[i]} {password}")
            except:
                print(
                    f"Manager level write fail user/empid: {empIds[i]}, password {password}"
                )
            values.append(
                (
                    empIds[i],
                    names[i],
                    *Customer.make_phone(),
                    hashlib.sha256(bytes(password, "utf-8")).hexdigest(),
                )
            )

        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `empID` int NOT NULL AUTO_INCREMENT,
  `managerName` varchar(100) NOT NULL,
  `phone_countryCode` int DEFAULT NULL,
  `phone_number` decimal(10,0) DEFAULT NULL,
  `password_hash` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`empID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
INSERT INTO `manager` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class Branch:
    """I shall only generate 100 Branches/interdisp"""

    def gen_IFSC():
        IFSC_bnk = secrets.choice(["SBIN", "PUNB", "KOTK", "HDFC"])
        IFSC_bcode = str(random.randint(100, 900000)).zfill(6)
        return IFSC_bnk + IFSC_bcode

    def gen_val(n=100):
        values = []
        for i in range(n):
            values.append((Branch.gen_IFSC(), *Branch.make_address()))
        return values

    def make_address():
        with open("data/CityNames", "r") as f:
            cities = f.read().split("\n")
        with open("data/CountryNames", "r") as f:
            countries = f.read().split("\n")
        with open("data/StateNames", "r") as f:
            state = f.read().split("\n")
        """Ship cities as locality for now, we just have to populate"""
        return (
            random.choice(cities),
            random.choice(state),
            random.choice(countries),
        )

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;

CREATE TABLE `branch` (
  `IFSC_code` varchar(10) NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  PRIMARY KEY (`IFSC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
INSERT INTO `branch` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class AccountType:
    def gen_val(branchbyman, customers, n=3):
        sno = 15674
        delta = 0
        values = []

        for n1, i in enumerate(customers):
            
            typeacc = "SAV"
            customer = i[0]
            epochdt = random.randint(1284286794, 1646222220)
            timestamp = datetime.datetime.fromtimestamp(epochdt).strftime("%Y-%m-%d %H:%M:%S")
            bmt = secrets.choice(branchbyman)
            delta += 1
            values.append((sno + delta, timestamp, typeacc, bmt[0], bmt[1], customer))
            if random.random() > 0.4:
                typeacc = "CRD"
                customer = i[0]
                epochdt = random.randint(1284286794, 1646222220)
                timestamp = datetime.datetime.fromtimestamp(epochdt).strftime("%Y-%m-%d %H:%M:%S")
                bmt = secrets.choice(branchbyman)
                delta += 1
                values.append((sno + delta, timestamp, typeacc, bmt[0], bmt[1], customer))
            if random.random() > 0.8:
                typeacc = "CUR"
                customer = i[0]
                epochdt = random.randint(1284286794, 1646222220)
                timestamp = datetime.datetime.fromtimestamp(epochdt).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                bmt = secrets.choice(branchbyman)
                delta += 1
                values.append((sno + delta, timestamp, typeacc, bmt[0], bmt[1], customer))
            if random.random() > 0.3:
                typeacc = "LON"
                customer = i[0]
                epochdt = random.randint(1284286794, 1646222220)
                timestamp = datetime.datetime.fromtimestamp(epochdt).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                bmt = secrets.choice(branchbyman)
                delta += 1
                values.append((sno + delta, timestamp, typeacc, bmt[0], bmt[1], customer))
        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""DROP TABLE IF EXISTS `accounttype`;
CREATE TABLE `accounttype` (
  `serialNo` int NOT NULL AUTO_INCREMENT,
  `dateOfOpening` timestamp NULL DEFAULT NULL,
  `typeAccount` varchar(3) DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `branch_code` varchar(10) DEFAULT NULL,
  `customer_id` varchar(10) NOT NULL,
  PRIMARY KEY (`serialNo`,`customer_id`),
  KEY `approver_id` (`approver_id`),
  KEY `branch_code` (`branch_code`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `accounttype_ibfk_1` FOREIGN KEY (`approver_id`) REFERENCES `manager` (`empID`),
  CONSTRAINT `accounttype_ibfk_2` FOREIGN KEY (`branch_code`) REFERENCES `branch` (`IFSC_code`),
  CONSTRAINT `accounttype_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`pancard`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accounttype`
--

LOCK TABLES `accounttype` WRITE;
INSERT INTO `accounttype` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class ManagedBy:
    def gen_val(managers, branches):
        values = []
        for i in branches:
            epochdt = random.randint(1284286794, 1546222220)
            timestamp = datetime.datetime.fromtimestamp(epochdt).strftime("%Y-%m-%d")
            values.append((secrets.choice(managers)[0], i[0], timestamp))
        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `managedby`
--

DROP TABLE IF EXISTS `managedby`;
CREATE TABLE `managedby` (
  `manager_id` int NOT NULL,
  `branch_id` varchar(10) NOT NULL,
  `dateofjoining` date NOT NULL,
  PRIMARY KEY (`manager_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `managedby_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`empID`),
  CONSTRAINT `managedby_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`IFSC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `managedby`
--

LOCK TABLES `managedby` WRITE;
INSERT INTO `managedby` VALUES {values};
UNLOCK TABLES;"""
        return injection


## Account creation logic
## For each account type, (sno + customer + type)
## create respective account


class AccountCreator:
    # instantiate this
    loanAccounts = []
    savingsAccounts = []
    currentAccounts = []
    CreditcardAccounts = []

    def gen_accounts(self, accounttypes):
        for i in accounttypes:
            # useful customer i[-1], acc type i[2]
            if i[2] == "SAV":
                self.create_savings(i)
            elif i[2] == "LON":
                self.create_loan(i)
            elif i[2] == "CUR":
                self.create_current(i)
            elif i[2] == "CRD":
                self.create_credit(i)
            else:
                print("ERROR OCCURED, but anyways")

    def create_loan(self, accounttype):
        accountno = int(
            hashlib.shake_128(bytes(str(accounttype), "utf-8")).hexdigest(6), 16
        )
        amountDue = random.randint(1000, 10_00_00_000)
        principal = random.randint(amountDue, amountDue * 10)
        interestRate = 4 + round(random.random(), 2) * 10
        billingCycle = random.randint(1, 400)
        epochdt = random.randint(int(time.time()) + 1000000, int(time.time()) + 3000000)
        dueDate = datetime.datetime.fromtimestamp(epochdt).strftime("%Y-%m-%d %H:%M:%S")
        customerId = accounttype[-1]
        serialNo = accounttype[0]
        self.loanAccounts.append(
            (
                accountno,
                amountDue,
                principal,
                interestRate,
                billingCycle,
                dueDate,
                serialNo,
                customerId,
            )
        )

    def create_current(self, accounttype):
        accountno = int(
            hashlib.shake_128(bytes(str(accounttype), "utf-8")).hexdigest(6), 16
        )
        balance = round(random.random() * random.randint(100000, 10000000000), 2)
        serialno = accounttype[0]
        customerId = accounttype[-1]

        self.currentAccounts.append((accountno, balance, serialno, customerId))

    def create_savings(self, accounttype):
        accountno = int(
            hashlib.shake_128(bytes(str(accounttype), "utf-8")).hexdigest(6), 16
        )
        balance = random.randint(1000, 10_00_00_000)
        minBalance = random.choice([1000, 10000, 100000, 5000, 0])
        interestRate = 4 + round(random.random(), 2)
        serialNo = accounttype[0]
        customerId = accounttype[-1]
        self.savingsAccounts.append(
            (accountno, balance, minBalance, interestRate, serialNo, customerId)
        )

    def create_credit(self, accounttype):
        accountno = int(
            hashlib.shake_128(bytes(str(accounttype), "utf-8")).hexdigest(6), 16
        )
        amountDue = random.randint(1000, 10_00_00_000)
        creditLimit = random.randint(100, 10000000000)
        creditSpent = random.randint(1000, 100000)
        billingCycle = random.randint(1, 120)
        interestRate = 4 + round(random.random(), 2) * 10
        epochdt = random.randint(int(time.time()) + 1000000, int(time.time()) + 3000000)
        dueDate = datetime.datetime.fromtimestamp(epochdt).strftime("%Y-%m-%d %H:%M:%S")
        customerId = accounttype[-1]
        serialNo = accounttype[0]
        self.CreditcardAccounts.append(
            (
                accountno,
                amountDue,
                creditLimit,
                creditSpent,
                billingCycle,
                dueDate,
                interestRate,
                serialNo,
                customerId,
            )
        )


class AccountInjectors:
    def savingsject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `savingsaccount`
--

DROP TABLE IF EXISTS `savingsaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savingsaccount` (
  `accountNo` decimal(18,0) NOT NULL,
  `balance` double NOT NULL,
  `minBalance` double NOT NULL,
  `interestRate` decimal(4,2) NOT NULL,
  `serialNo` int DEFAULT NULL,
  `customerId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`accountNo`),
  KEY `serialNo` (`serialNo`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `savingsaccount_ibfk_1` FOREIGN KEY (`serialNo`) REFERENCES `accounttype` (`serialNo`),
  CONSTRAINT `savingsaccount_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `accounttype` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savingsaccount`
--

LOCK TABLES `savingsaccount` WRITE;
INSERT INTO `savingsaccount` VALUES {values};
UNLOCK TABLES;
"""
        return injection

    def currject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `currentaccount`
--

DROP TABLE IF EXISTS `currentaccount`;
CREATE TABLE `currentaccount` (
  `accountNo` decimal(18,0) NOT NULL,
  `balance` double NOT NULL,
  `serialNo` int DEFAULT NULL,
  `customerId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`accountNo`),
  KEY `serialNo` (`serialNo`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `currentaccount_ibfk_1` FOREIGN KEY (`serialNo`) REFERENCES `accounttype` (`serialNo`),
  CONSTRAINT `currentaccount_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `accounttype` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `currentaccount`
--

LOCK TABLES `currentaccount` WRITE;
INSERT INTO `currentaccount` VALUES {values};
UNLOCK TABLES;
"""
        return injection

    def loanject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `loanaccount`
--

DROP TABLE IF EXISTS `loanaccount`;
CREATE TABLE `loanaccount` (
  `accountNo` decimal(18,0) NOT NULL,
  `amountDue` double NOT NULL,
  `principal` double NOT NULL,
  `interestRate` decimal(4,2) NOT NULL,
  `billingCycle` int NOT NULL,
  `dueDate` date NOT NULL,
  `serialNo` int DEFAULT NULL,
  `customerId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`accountNo`),
  KEY `serialNo` (`serialNo`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `loanaccount_ibfk_1` FOREIGN KEY (`serialNo`) REFERENCES `accounttype` (`serialNo`),
  CONSTRAINT `loanaccount_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `accounttype` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loanaccount`
--

LOCK TABLES `loanaccount` WRITE;
INSERT INTO `loanaccount` VALUES {values};
UNLOCK TABLES;
"""
        return injection

    def creditject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `creditcardaccount`
--

DROP TABLE IF EXISTS `creditcardaccount`;
CREATE TABLE `creditcardaccount` (
  `accountNo` decimal(18,0) NOT NULL,
  `amountDue` double NOT NULL,
  `creditLimit` double NOT NULL,
  `creditSpent` double NOT NULL,
  `billingCycle` int NOT NULL,
  `dueDate` date NOT NULL,
  `interestRate` decimal(4,2) NOT NULL,
  `serialNo` int DEFAULT NULL,
  `customerId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`accountNo`),
  KEY `serialNo` (`serialNo`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `creditcardaccount_ibfk_1` FOREIGN KEY (`serialNo`) REFERENCES `accounttype` (`serialNo`),
  CONSTRAINT `creditcardaccount_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `accounttype` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `creditcardaccount`
--

LOCK TABLES `creditcardaccount` WRITE;
INSERT INTO `creditcardaccount` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class CreditCard:
    def gen_val(creditcardaccs):
        values = []
        for i in creditcardaccs:
            cardNo = int(
                str(
                    int(hashlib.shake_128(bytes(str(i), "utf-8")).hexdigest(6), 16)
                ).zfill(16)[::-1]
            )
            cvv = random.randint(100, 999)
            pin = random.randint(0, 9999)
            try:
                with open("data/LoginDumpCreditCards", "a") as f:
                    f.write(f"{cardNo} {cvv} {str(pin).zfill(4)}")
            except:
                print(f"{cardNo} {cvv} {str(pin).zfill(4)}")
            ccan = i[0]
            epochdt = random.randint(int(time.time()) + 10000000, int(time.time()) + 100000000)
            expiryDate = datetime.datetime.fromtimestamp(epochdt).strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            values.append((cardNo, cvv, expiryDate, pin, ccan))
        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `creditcard`
--

DROP TABLE IF EXISTS `creditcard`;

CREATE TABLE `creditcard` (
  `cardNo` decimal(16,0) NOT NULL,
  `CVV` decimal(3,0) NOT NULL,
  `expiryDate` date NOT NULL,
  `pin` decimal(4,0) NOT NULL,
  `creditCardAccountNo` decimal(16,0) DEFAULT NULL,
  PRIMARY KEY (`cardNo`),
  KEY `creditCardAccountNo` (`creditCardAccountNo`),
  CONSTRAINT `creditcard_ibfk_1` FOREIGN KEY (`creditCardAccountNo`) REFERENCES `creditcardaccount` (`accountNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `creditcard`
--

LOCK TABLES `creditcard` WRITE;
INSERT INTO `creditcard` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class DebitCard:
    def gen_val(debitcardaccs):
        values = []
        for i in debitcardaccs:
            cardNo = int(
                str(
                    int(hashlib.shake_128(bytes(str(i), "utf-8")).hexdigest(6), 16)
                ).zfill(16)[::-1]
            )
            cvv = random.randint(100, 999)
            pin = random.randint(0, 9999)
            try:
                with open("data/LoginDumpDebitCards", "a") as f:
                    f.write(f"{cardNo} {cvv} {str(pin).zfill(4)}")
            except:
                print(f"{cardNo} {cvv} {str(pin).zfill(4)}")
            dcan = i[0]
            epochdt = random.randint(int(time.time()) + 10000000, int(time.time()) + 100000000)
            expiryDate = datetime.datetime.fromtimestamp(epochdt).strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            values.append((cardNo, cvv, expiryDate, pin, dcan))
        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `debitcard`
--

DROP TABLE IF EXISTS `debitcard`;

CREATE TABLE `debitcard` (
  `cardNo` decimal(16,0) NOT NULL,
  `CVV` decimal(3,0) NOT NULL,
  `expiryDate` date NOT NULL,
  `pin` decimal(4,0) NOT NULL,
  `savingsAccountNo` decimal(16,0) DEFAULT NULL,
  PRIMARY KEY (`cardNo`),
  KEY `savingsAccountNo` (`savingsAccountNo`),
  CONSTRAINT `debitcard_ibfk_1` FOREIGN KEY (`savingsAccountNo`) REFERENCES `savingsaccount` (`accountNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `debitcard`
--

LOCK TABLES `debitcard` WRITE;
INSERT INTO `debitcard` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class Cheque:
    """We shall issue 2000 cheques"""

    def gen_val(savingsaccs, currentaccs, n=2000):
        values = []
        for i in range(n):
            epochdt = random.randint(1484286794, 1646222220)
            dateOfIssue = datetime.datetime.fromtimestamp(epochdt).strftime(
                "'%Y-%m-%d'"
            )
            recipientaccno = secrets.choice(random.choice([savingsaccs, currentaccs]))[
                0
            ]
            amount = random.randint(1, 50000) * 1000
            ownersav = "null"
            ownercurr = "null"
            if random.random() > 0.5:
                ownercurr = secrets.choice(currentaccs)[0]
            else:
                ownersav = secrets.choice(savingsaccs)[0]

            values.append(
                (
                    int(
                        str(
                            int(
                                hashlib.shake_128(bytes(str(i), "utf-8")).hexdigest(4),
                                16,
                            )
                        ).zfill(12)[::-1]
                    ),
                    dateOfIssue,
                    recipientaccno,
                    amount,
                    ownersav,
                    ownercurr,
                )
            )
        return values

    def inject(values):
        values = ",".join("(" + ",".join([str(i) for i in tup]) + ")" for tup in values)
        injection = f"""DROP TABLE IF EXISTS `cheque`;
CREATE TABLE `cheque` (
  `chequeNo` decimal(12,0) NOT NULL,
  `dateOfIssue` date NOT NULL,
  `accountNo` decimal(18,0) NOT NULL,
  `amount` double NOT NULL,
  `ownerSavingAccount` decimal(18,0) DEFAULT NULL,
  `ownerCurrentAccount` decimal(18,0) DEFAULT NULL,
  PRIMARY KEY (`chequeNo`),
  KEY `ownerSavingAccount` (`ownerSavingAccount`),
  KEY `ownerCurrentAccount` (`ownerCurrentAccount`),
  CONSTRAINT `cheque_ibfk_1` FOREIGN KEY (`ownerSavingAccount`) REFERENCES `savingsaccount` (`accountNo`),
  CONSTRAINT `cheque_ibfk_2` FOREIGN KEY (`ownerCurrentAccount`) REFERENCES `currentaccount` (`accountNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cheque`
--

LOCK TABLES `cheque` WRITE;
INSERT INTO `cheque` VALUES {values};
UNLOCK TABLES;
"""
        return injection


class ATM:
    def gen_val(branches, n=10000):
        values = []

        for i in range(n):
            atmId = int(
                str(
                    int(
                        hashlib.shake_128(bytes(str(i), "utf-8")).hexdigest(6),
                        16,
                    )
                ).zfill(18)[::-1]
            )
            currentBalance = random.randint(0, 2000000)
            branch = secrets.choice(branches)
            values.append(
                (
                    atmId,
                    branch[1] + f" F{secrets.token_urlsafe(3)}",
                    *branch[2:],
                    currentBalance,
                    branch[0],
                )
            )

        return values

    def inject(values):
        values = ",".join(str(tup) for tup in values)
        injection = f"""--
-- Table structure for table `atm`
--

DROP TABLE IF EXISTS `atm`;

CREATE TABLE `atm` (
  `atmId` decimal(18,0) NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  `currentBalance` double NOT NULL,
  `branch_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`atmId`),
  KEY `branch_code` (`branch_code`),
  CONSTRAINT `atm_ibfk_1` FOREIGN KEY (`branch_code`) REFERENCES `branch` (`IFSC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `atm`
--

LOCK TABLES `atm` WRITE;
INSERT INTO `atm` VALUES {values};
UNLOCK TABLES;
"""

        return injection


class Transaction:
    def gen_val(
        cheques,
        debitcards,
        creditcards,
        atms,
        accounttypes,
        currentaccounts,
        savingsaccounts,
        loansaccounts,
        ccaccount,
        n=100000,
    ):
        values = []
        for i in cheques:
            # txnid,toacc,totype
            # modeofpayment,amount
            # timeoftransaction
            # chequeno, dcno,ccno,atmid,atmcardno
            # fromaccserialno
            # fromaccustomer pan
            txnId = int(
                str(
                    int(
                        hashlib.shake_128(bytes(str(i), "utf-8")).hexdigest(7),
                        16,
                    )
                ).zfill(18)[::-1]
            )
            toacc = i[2]
            # totype = "'SAV'" if i[4] != "null" else "'CUR'"
            for temp in savingsaccounts:
                if temp[0] == i[2]:
                    totype = "'SAV'"
                    fromcustpan = temp[-1]
                    fromcustserno = temp[-2]
            for temp in currentaccounts:
                if temp[0] == i[2]:
                    totype = "'CUR'"
                    fromcustpan = temp[-1]
                    fromcustserno = temp[-2]
            for temp in loansaccounts:
                if temp[0] == i[2]:
                    totype = "'LON'"
                    fromcustpan = temp[-1]
                    fromcustserno = temp[-2]
            for temp in ccaccount:
                if temp[0] == i[2]:
                    totype = "'CRD'"
                    fromcustpan = temp[-1]
                    fromcustserno = temp[-2]
            modeOfPayment = "'ONL'"
            amount = i[3]
            chequeno = i[0]
            dcno = ccno = atmid = atmcardno = "null"

            values.append(
                (
                    txnId,
                    toacc,
                    totype,
                    modeOfPayment,
                    amount,
                    i[1][:-1] + " 00:00:00'",
                    chequeno,
                    dcno,
                    ccno,
                    atmid,
                    atmcardno,
                    fromcustserno,
                    "'" + fromcustpan + "'",
                )
            )

        # now we shall generate arbitrary transactions from savings accs
        for i in range(n):
            # txnid,toacc,totype
            # modeofpayment,amount
            # timeoftransaction
            # chequeno, dcno,ccno,atmid,atmcardno
            # fromaccserialno
            # fromaccustomer pan
            txnId = int(
                str(
                    int(
                        hashlib.shake_128(bytes(str(i) + "ad", "utf-8")).hexdigest(7),
                        16,
                    )
                ).zfill(18)[::-1]
            )
            toacctype = secrets.choice([0, 1, 2, 3])
            encodes = ["'CUR'", "'SAV'", "'LON'", "'CRD'"]
            totype = encodes[toacctype]
            if totype == "'SAV'":
                toacc = secrets.choice(savingsaccounts)
            elif totype == "'CUR'":
                toacc = secrets.choice(currentaccounts)
            elif totype == "'LON'":
                toacc = secrets.choice(loansaccounts)
            elif totype == "'CRD'":
                toacc = secrets.choice(ccaccount)
            modeOfPayment = "'ONL'"
            amount = random.randint(100, 900000) * 10
            timestamp = datetime.datetime.fromtimestamp(
                random.randint(1284286794, 1646222220)
            ).strftime("'%Y-%m-%d %H:%M:%S'")
            chequeno = dcno = ccno = atmid = atmcardno = "null"

            fromacctype = secrets.choice([0, 1, 2])
            fromenc = ["'SAV'", "'CUR'", "'CRD'"]
            fromtype = fromenc[fromacctype]

            if fromtype == "'SAV'":
                fromacc = secrets.choice(savingsaccounts)
            elif fromtype == "'CUR'":
                fromacc = secrets.choice(currentaccounts)
            elif fromtype == "'CRD'":
                fromacc = secrets.choice(ccaccount)

            if random.random() > 0.6:
                if fromtype == "'SAV'":
                    for debitcard in debitcards:
                        if debitcard[-1] == fromacc[0]:
                            dcno = debitcard[0]
                    if random.random() > 0.4:
                        toacc = "null"
                        totype = "null"
                        modeOfPayment = "'OFF'"
                        atmid = random.choice(atms)[0]
                        atmcardno = dcno
                elif fromtype == "'CRD'":
                    for creditcard in creditcards:
                        if creditcard[-1] == fromacc[0]:
                            ccno = creditcard[0]

            values.append(
                (
                    txnId,
                    toacc[0] if toacc != "null" else toacc,
                    totype,
                    modeOfPayment,
                    amount,
                    timestamp,
                    chequeno,
                    dcno,
                    ccno,
                    atmid,
                    atmcardno,
                    fromacc[-2],
                    "'" + fromacc[-1] + "'",
                )
            )

        return values

    def inject(values):
        values = ",".join("(" + ",".join([str(i) for i in tup]) + ")" for tup in values)
        injection = f"""--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `txnId` decimal(18,0) NOT NULL,
  `toAccount` decimal(18,0) DEFAULT NULL,
  `toType` varchar(3) DEFAULT NULL,
  `modeOfPayment` varchar(3) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `timeOfTransaction` timestamp NULL DEFAULT NULL,
  `chequeNo` decimal(12,0) DEFAULT NULL,
  `debitCardNo` decimal(16,0) DEFAULT NULL,
  `creditCardNo` decimal(16,0) DEFAULT NULL,
  `ATMid` decimal(18,0) DEFAULT NULL,
  `ATMCardNo` decimal(16,0) DEFAULT NULL,
  `fromAccserialNo` int DEFAULT NULL,
  `fromAcccustomerId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`txnId`),
  KEY `chequeNo` (`chequeNo`),
  KEY `debitCardNo` (`debitCardNo`),
  KEY `creditCardNo` (`creditCardNo`),
  KEY `ATMid` (`ATMid`),
  KEY `ATMCardNo` (`ATMCardNo`),
  KEY `fromAccserialNo` (`fromAccserialNo`),
  KEY `fromAcccustomerId` (`fromAcccustomerId`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`chequeNo`) REFERENCES `cheque` (`chequeNo`),
  CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`debitCardNo`) REFERENCES `debitcard` (`cardNo`),
  CONSTRAINT `transaction_ibfk_3` FOREIGN KEY (`creditCardNo`) REFERENCES `creditcard` (`cardNo`),
  CONSTRAINT `transaction_ibfk_4` FOREIGN KEY (`ATMid`) REFERENCES `atm` (`atmId`),
  CONSTRAINT `transaction_ibfk_5` FOREIGN KEY (`ATMCardNo`) REFERENCES `debitcard` (`cardNo`),
  CONSTRAINT `transaction_ibfk_6` FOREIGN KEY (`fromAccserialNo`) REFERENCES `accounttype` (`serialNo`),
  CONSTRAINT `transaction_ibfk_7` FOREIGN KEY (`fromAcccustomerId`) REFERENCES `accounttype` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
INSERT INTO `transaction` VALUES {values};
UNLOCK TABLES;
"""
        return injection


# append argument n=something to control data pops
customers = Customer.master_make_values()
managers = Manager.gen_val()
branches = Branch.gen_val()
branchbyman = ManagedBy.gen_val(managers, branches)
accounttypes = AccountType.gen_val(branchbyman, customers)

acc_auto = AccountCreator()
acc_auto.gen_accounts(accounttypes)

debitcards = DebitCard.gen_val(acc_auto.savingsAccounts)
creditcards = CreditCard.gen_val(acc_auto.CreditcardAccounts)

cheques = Cheque.gen_val(acc_auto.savingsAccounts, acc_auto.currentAccounts)
atms = ATM.gen_val(branches)
txns = Transaction.gen_val(
    cheques,
    debitcards,
    creditcards,
    atms,
    accounttypes,
    acc_auto.currentAccounts,
    acc_auto.savingsAccounts,
    acc_auto.loanAccounts,
    acc_auto.CreditcardAccounts,
)

with open("data/tryjection.sql", "w") as f:
    f.write(initstring)
    f.write(Customer.inject(customers))
    f.write(Manager.inject(managers))
    f.write(Branch.inject(branches))
    f.write(ManagedBy.inject(branchbyman))
    f.write(AccountType.inject(accounttypes))
    f.write(AccountInjectors.creditject(acc_auto.CreditcardAccounts))
    f.write(AccountInjectors.savingsject(acc_auto.savingsAccounts))
    f.write(AccountInjectors.currject(acc_auto.currentAccounts))
    f.write(AccountInjectors.loanject(acc_auto.loanAccounts))
    f.write(DebitCard.inject(debitcards))
    f.write(CreditCard.inject(creditcards))
    f.write(Cheque.inject(cheques))
    f.write(ATM.inject(atms))
    f.write(Transaction.inject(txns))
    with open("../SQL_scripts/balance_updation_trigger.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/insufficient_balance_trigger.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/customerinfo_view_manager_grant.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/accountCreationTriggers.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/index.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/transactionaccounttype_view_manager_grant.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/account_deletion_triggers_useless.sql", "r") as g:
        f.write(g.read())
    with open("../SQL_scripts/branchinfo_view_customer_grant.sql", "r") as g:
        f.write(g.read())
