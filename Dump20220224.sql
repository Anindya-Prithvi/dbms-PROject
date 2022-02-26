-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: sql_hr
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `job_title` varchar(50) NOT NULL,
  `salary` int NOT NULL,
  `reports_to` int DEFAULT NULL,
  `office_id` int NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `fk_employees_offices_idx` (`office_id`),
  KEY `fk_employees_employees_idx` (`reports_to`),
  CONSTRAINT `fk_employees_managers` FOREIGN KEY (`reports_to`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `fk_employees_offices` FOREIGN KEY (`office_id`) REFERENCES `offices` (`office_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (33391,'D\'arcy','Nortunen','Account Executive',62871,37270,1),(37270,'Yovonnda','Magrannell','Executive Secretary',63996,NULL,10),(37851,'Sayer','Matterson','Statistician III',98926,37270,1),(40448,'Mindy','Crissil','Staff Scientist',94860,37270,1),(56274,'Keriann','Alloisi','VP Marketing',110150,37270,1),(63196,'Alaster','Scutchin','Assistant Professor',32179,37270,2),(67009,'North','de Clerc','VP Product Management',114257,37270,2),(67370,'Elladine','Rising','Social Worker',96767,37270,2),(68249,'Nisse','Voysey','Financial Advisor',52832,37270,2),(72540,'Guthrey','Iacopetti','Office Assistant I',117690,37270,3),(72913,'Kass','Hefferan','Computer Systems Analyst IV',96401,37270,3),(75900,'Virge','Goodrum','Information Systems Manager',54578,37270,3),(76196,'Mirilla','Janowski','Cost Accountant',119241,37270,3),(80529,'Lynde','Aronson','Junior Executive',77182,37270,4),(80679,'Mildrid','Sokale','Geologist II',67987,37270,4),(84791,'Hazel','Tarbert','General Manager',93760,37270,4),(95213,'Cole','Kesterton','Pharmacist',86119,37270,4),(96513,'Theresa','Binney','Food Chemist',47354,37270,5),(98374,'Estrellita','Daleman','Staff Accountant IV',70187,37270,5),(115357,'Ivy','Fearey','Structural Engineer',92710,37270,5);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `office_id` int NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  PRIMARY KEY (`office_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'03 Reinke Trail','Cincinnati','OH'),(2,'5507 Becker Terrace','New York City','NY'),(3,'54 Northland Court','Richmond','VA'),(4,'08 South Crossing','Cincinnati','OH'),(5,'553 Maple Drive','Minneapolis','MN'),(6,'23 North Plaza','Aurora','CO'),(7,'9658 Wayridge Court','Boise','ID'),(8,'9 Grayhawk Trail','New York City','NY'),(9,'16862 Westend Hill','Knoxville','TN'),(10,'4 Bluestem Parkway','Savannah','GA');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sql_hr'
--

--
-- Dumping routines for database 'sql_hr'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-24 22:23:29
