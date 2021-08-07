-- MySQL dump 10.19  Distrib 10.3.29-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 192.168.1.10    Database: keyboard
-- ------------------------------------------------------
-- Server version       10.3.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `all_purchases`
--

DROP TABLE IF EXISTS `all_purchases`;
/*!50001 DROP VIEW IF EXISTS `all_purchases`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `all_purchases` (
  `id` tinyint NOT NULL,
  `cateory_name` tinyint NOT NULL,
  `detail` tinyint NOT NULL,
  `entity` tinyint NOT NULL,
  `maker_name` tinyint NOT NULL,
  `maker_id` tinyint NOT NULL,
  `vendor_name` tinyint NOT NULL,
  `vendor_id` tinyint NOT NULL,
  `price` tinyint NOT NULL,
  `adjustments` tinyint NOT NULL,
  `sale_type` tinyint NOT NULL,
  `received` tinyint NOT NULL,
  `purchaseDate` tinyint NOT NULL,
  `receivedDate` tinyint NOT NULL,
  `orderSet` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `makers`
--

DROP TABLE IF EXISTS `makers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `makers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  `instagram` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `idx_makers_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` int(11) NOT NULL,
  `detail` varchar(200) NOT NULL,
  `entity` varchar(200) NOT NULL,
  `maker` int(11) NOT NULL,
  `vendor` int(11) NOT NULL,
  `price` decimal(13,2) NOT NULL,
  `adjustments` decimal(13,2) NOT NULL,
  `saleType` int(11) NOT NULL,
  `received` tinyint(4) NOT NULL,
  `purchaseDate` date NOT NULL,
  `receivedDate` date NOT NULL,
  `orderSet` int(11) NOT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `category_idx` (`category`),
  KEY `maker_idx` (`maker`),
  KEY `vendor_idx` (`vendor`),
  KEY `saleType_idx` (`saleType`),
  CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `maker` FOREIGN KEY (`maker`) REFERENCES `makers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `saleType` FOREIGN KEY (`saleType`) REFERENCES `sale_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `vendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sale_types`
--

DROP TABLE IF EXISTS `sale_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  `link` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `all_purchases`
--

/*!50001 DROP TABLE IF EXISTS `all_purchases`*/;
/*!50001 DROP VIEW IF EXISTS `all_purchases`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`blap`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `all_purchases` AS select `p`.`id` AS `id`,`c`.`display_name` AS `cateory_name`,`p`.`detail` AS `detail`,`p`.`entity` AS `entity`,`m`.`display_name` AS `maker_name`,`m`.`id` AS `maker_id`,`v`.`display_name` AS `vendor_name`,`v`.`id` AS `vendor_id`,`p`.`price` AS `price`,`p`.`adjustments` AS `adjustments`,`s`.`display_name` AS `sale_type`,`p`.`received` AS `received`,`p`.`purchaseDate` AS `purchaseDate`,`p`.`receivedDate` AS `receivedDate`,`p`.`orderSet` AS `orderSet` from ((((`purchases` `p` left join `categories` `c` on(`c`.`id` = `p`.`category`)) left join `makers` `m` on(`m`.`id` = `p`.`maker`)) left join `vendors` `v` on(`v`.`id` = `p`.`vendor`)) left join `sale_types` `s` on(`s`.`id` = `p`.`saleType`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;