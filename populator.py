# Population control

import random, time, secrets, hashlib, string


def main():
    pass


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
        user: str = fromname.lower()[:-1] + hex(random.SystemRandom().randint(1,10000000)).upper()[-5:]
        password: str = secrets.token_urlsafe(8)
        passwordhash: str = hashlib.sha256(bytes(password, "utf-8")).hexdigest()
        with open("LoginDump", "a") as f:
            f.write(user + " " + password + " " + passwordhash + "\n")
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

    def master_make_values():
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
        for _ in range(30000):
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
                    customerName,
                    *Customer.make_address(cities, countries, states),
                    pan,
                    creditScore,
                    *Customer.make_phone(),
                    *Customer.make_userpass(customerName),
                )
            )

        values = ",".join(str(tup) for tup in values)

        injection = f"""DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `name` varchar(100) NOT NULL,
  `address_flatno` int NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  `pancard` varchar(10) NOT NULL,
  `creditScore` int DEFAULT NULL,
  `phone_countryCode` int DEFAULT NULL,
  `phone_number` numeric(10,0) DEFAULT NULL,
  `username` varchar(32) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  PRIMARY KEY (`pancard`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
INSERT INTO `customers` VALUES {values};
UNLOCK TABLES;
"""
        return injection

with open("tryjection.sql","w") as f:
    f.write(Customer.master_make_values())
