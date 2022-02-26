-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: bdsm
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `accountNo` varchar(12) NOT NULL,
  `dateOfOpening` date NOT NULL,
  PRIMARY KEY (`accountNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `IFSC_code` varchar(10) NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  PRIMARY KEY (`IFSC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheque`
--

DROP TABLE IF EXISTS `cheque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cheque` (
  `dateOfIssue` date DEFAULT NULL,
  `recipientName` varchar(50) DEFAULT NULL,
  `chequeNo` decimal(12,0) DEFAULT NULL,
  `accountNo` decimal(10,0) DEFAULT NULL,
  UNIQUE KEY `chequeNo` (`chequeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheque`
--

LOCK TABLES `cheque` WRITE;
/*!40000 ALTER TABLE `cheque` DISABLE KEYS */;
/*!40000 ALTER TABLE `cheque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditCard`
--

DROP TABLE IF EXISTS `creditCard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditCard` (
  `cardNo` decimal(16,0) NOT NULL,
  `CVV` decimal(3,0) DEFAULT NULL,
  `holderName` varchar(20) DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `pin` decimal(4,0) DEFAULT NULL,
  PRIMARY KEY (`cardNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditCard`
--

LOCK TABLES `creditCard` WRITE;
/*!40000 ALTER TABLE `creditCard` DISABLE KEYS */;
/*!40000 ALTER TABLE `creditCard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditCardAccount`
--

DROP TABLE IF EXISTS `creditCardAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditCardAccount` (
  `amountDue` int DEFAULT NULL,
  `creditLimit` int DEFAULT NULL,
  `creditSpent` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditCardAccount`
--

LOCK TABLES `creditCardAccount` WRITE;
/*!40000 ALTER TABLE `creditCardAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `creditCardAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentAccount`
--

DROP TABLE IF EXISTS `currentAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentAccount` (
  `balance` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currentAccount`
--

LOCK TABLES `currentAccount` WRITE;
/*!40000 ALTER TABLE `currentAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `currentAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `name` varchar(100) NOT NULL,
  `address_flatno` int NOT NULL,
  `address_locality` varchar(100) NOT NULL,
  `address_state` varchar(50) NOT NULL,
  `address_country` varchar(50) NOT NULL,
  `pancard` varchar(10) NOT NULL,
  `creditScore` int DEFAULT NULL,
  `phone_countryCode` int DEFAULT NULL,
  `phone_number` int DEFAULT NULL,
  `username` varchar(16) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  PRIMARY KEY (`pancard`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debitCard`
--

DROP TABLE IF EXISTS `debitCard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debitCard` (
  `cardNo` decimal(16,0) NOT NULL,
  `CVV` decimal(3,0) DEFAULT NULL,
  `holderName` varchar(20) DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `pin` decimal(4,0) DEFAULT NULL,
  PRIMARY KEY (`cardNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debitCard`
--

LOCK TABLES `debitCard` WRITE;
/*!40000 ALTER TABLE `debitCard` DISABLE KEYS */;
/*!40000 ALTER TABLE `debitCard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loanAccount`
--

DROP TABLE IF EXISTS `loanAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loanAccount` (
  `amountDue` int DEFAULT NULL,
  `principal` int DEFAULT NULL,
  `interestRate` decimal(4,2) DEFAULT NULL,
  `billingCycle` int DEFAULT NULL,
  `dueDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loanAccount`
--

LOCK TABLES `loanAccount` WRITE;
/*!40000 ALTER TABLE `loanAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `loanAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `empID` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `aadhar` varchar(12) NOT NULL,
  `phoneNo` int NOT NULL,
  `branchIFSC` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`empID`),
  KEY `branchIFSC` (`branchIFSC`),
  CONSTRAINT `manager_ibfk_1` FOREIGN KEY (`branchIFSC`) REFERENCES `branch` (`IFSC_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savingsAccount`
--

DROP TABLE IF EXISTS `savingsAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savingsAccount` (
  `balance` int DEFAULT NULL,
  `minBalance` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savingsAccount`
--

LOCK TABLES `savingsAccount` WRITE;
/*!40000 ALTER TABLE `savingsAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `savingsAccount` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-26  1:59:34
