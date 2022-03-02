# Population control

import random, time, secrets, hashlib, string, datetime

DATABASE_PROJECT_NAME = "BDSM"
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
        # with open("PRnames","r") as f:
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
            with open("LoginDumpUser", "a") as f:
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
        with open("PRnames") as f:
            names = f.read().split()
        with open("CityNames") as f:
            cities = f.read().split()
        with open("CountryNames") as f:
            countries = f.read().split()
        with open("StateNames") as f:
            states = f.read().split()
        PANnumbers = set()
        for _ in range(n):
            PANnumbers.add(
                "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
                + f"{random.randint(1,9999)}".zfill(4)
                + random.choice(string.ascii_uppercase)
            )
        for pan in PANnumbers:
            print(f"Adding user for pan: {pan}")
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
        with open("PRnames") as f:
            names = f.read().split()
        random.shuffle(names)
        names = names[:n]

        values = []
        for i in range(n):
            password = secrets.token_urlsafe(8)
            try:
                with open("LoginDumpManager", "a") as f:
                    f.write(f"{empIds[i]} {password}")
            except:
                print(f"Manager level user/empid: {empIds[i]}, password {password}")
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
        with open("CityNames", "r") as f:
            cities = f.read().split()
        with open("CountryNames", "r") as f:
            countries = f.read().split()
        with open("StateNames", "r") as f:
            state = f.read().split()
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
    def gen_val(branchbyman, customers, n=1000):
        sno = 15675
        values = []
        sav_creates = [] # to prevent multiple savings :trollblob:

        for i in range(n):
            while True:
                typeacc = secrets.choice(["SAV", "CUR", "LON", "CRD"])
                customer = secrets.choice(customers)[0]
                if(typeacc=="SAV" and customer in sav_creates): continue
                epochdt = random.randint(1284286794, 1646222220)
                timestamp = datetime.datetime.fromtimestamp(epochdt).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                break
            bmt = secrets.choice(branchbyman)
            values.append((sno + i, timestamp, typeacc, bmt[0], bmt[1], customer))
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
            timestamp = datetime.datetime.fromtimestamp(epochdt).strftime(
                "%Y-%m-%d"
            )
            values.append((secrets.choice(managers)[0], i[0],timestamp))
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
            if i[2]=="SAV":
                self.create_savings(i)
            elif i[2]=="LON":
                self.create_loan(i)
            elif i[2]=="CUR":
                self.create_current(i)
            elif i[2]=="CRD":
                self.create_credit(i)
            else:
                print("ERROR OCCURED, but anyways")
    
    def create_loan(self, accounttype):
        accountno = int(hashlib.shake_128(bytes(str(accounttype), 'utf-8')).hexdigest(6),16)
        amountDue = random.randint(1000,10_00_00_000)
        principal = random.randint(amountDue, amountDue*10)
        interestRate = round(random.random(),2)*10
        billingCycle = random.randint(1,400)
        epochdt = random.randint(1642222220,1946222220)
        dueDate = datetime.datetime.fromtimestamp(epochdt).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
        customerId = accounttype[-1]
        serialNo = accounttype[0]
        self.loanAccounts.append((
            accountno,
            amountDue,
            principal,
            interestRate,
            billingCycle,
            dueDate,
            serialNo,
            customerId
        ))

    def create_current(self, accounttype):
        accountno = int(hashlib.shake_128(bytes(str(accounttype), 'utf-8')).hexdigest(6),16)
        balance = round(random.random()*random.randint(100000,10000000000),2)
        serialno = accounttype[0]
        customerId = accounttype[-1]

        self.currentAccounts.append((
            accountno,
            balance,
            serialno,
            customerId
        ))
    
    def create_savings(self, accounttype):
        accountno = int(hashlib.shake_128(bytes(str(accounttype), 'utf-8')).hexdigest(6),16)
        balance = random.randint(1000,10_00_00_000)
        minBalance = random.choice([1000,10000,100000,5000,0])
        interestRate = round(random.random(),2)*10
        serialNo = accounttype[0]
        customerId = accounttype[-1]
        self.savingsAccounts.append((
            accountno,
            balance,
            minBalance,
            interestRate,
            serialNo,
            customerId
        ))

    def create_credit(self, accounttype):
        accountno = int(hashlib.shake_128(bytes(str(accounttype), 'utf-8')).hexdigest(6),16)
        amountDue = random.randint(1000,10_00_00_000)
        creditLimit = random.randint(100,10000000000)
        creditSpent = random.randint(1000,100000)
        billingCycle = random.randint(1,120)
        interestRate = round(random.random(),2)*10
        epochdt = random.randint(1642222220,1946222220)
        dueDate = datetime.datetime.fromtimestamp(epochdt).strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
        customerId = accounttype[-1]
        serialNo = accounttype[0]
        self.CreditcardAccounts.append((
            accountno,
            amountDue,
            creditLimit,
            creditSpent,
            billingCycle,
            dueDate,
            interestRate,
            serialNo,
            customerId
        ))

    
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



# append argument n=something to control data pops
customers = Customer.master_make_values()
managers = Manager.gen_val()
branches = Branch.gen_val()
branchbyman = ManagedBy.gen_val(managers, branches)
accounttypes = AccountType.gen_val(branchbyman, customers)

acc_auto = AccountCreator()
acc_auto.gen_accounts(accounttypes)

with open("tryjection.sql", "w") as f:
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
