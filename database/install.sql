-- MariaDB dump 10.19  Distrib 10.6.7-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 192.168.1.10    Database: keyboard
-- ------------------------------------------------------
-- Server version       10.3.32-MariaDB

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
-- Current Database: `keyboard`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `keyboard` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `keyboard`;

--
-- Temporary table structure for view `all_purchases`
--

DROP TABLE IF EXISTS `all_purchases`;
/*!50001 DROP VIEW IF EXISTS `all_purchases`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `all_purchases` (
  `id` tinyint NOT NULL,
  `category_id` tinyint NOT NULL,
  `category_name` tinyint NOT NULL,
  `detail` tinyint NOT NULL,
  `entity` tinyint NOT NULL,
  `sculpt` tinyint NOT NULL,
  `ka_id` tinyint NOT NULL,
  `maker_name` tinyint NOT NULL,
  `maker_id` tinyint NOT NULL,
  `instagram` tinyint NOT NULL,
  `archivist` tinyint NOT NULL,
  `vendor_name` tinyint NOT NULL,
  `vendor_id` tinyint NOT NULL,
  `link` tinyint NOT NULL,
  `price` tinyint NOT NULL,
  `adjustments` tinyint NOT NULL,
  `total` tinyint NOT NULL,
  `series_num` tinyint NOT NULL,
  `series_total` tinyint NOT NULL,
  `sale_id` tinyint NOT NULL,
  `sale_type` tinyint NOT NULL,
  `soldDate` tinyint NOT NULL,
  `salePrice` tinyint NOT NULL,
  `isSold` tinyint NOT NULL,
  `willSell` tinyint NOT NULL,
  `received` tinyint NOT NULL,
  `purchaseDate` tinyint NOT NULL,
  `receivedDate` tinyint NOT NULL,
  `orderSet` tinyint NOT NULL,
  `notes` tinyint NOT NULL,
  `image` tinyint NOT NULL,
  `tags` tinyint NOT NULL
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
  `archivist_name` varchar(105) DEFAULT NULL,
  `archivist_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `display_name_UNIQUE` (`display_name`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `idx_makers_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metadata`
--

DROP TABLE IF EXISTS `metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `metadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_id` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  CONSTRAINT `p_id_fkey` FOREIGN KEY (`id`) REFERENCES `purchases` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `purchase_tags`
--

DROP TABLE IF EXISTS `purchase_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idpurchase_tags_UNIQUE` (`id`),
  KEY `fk_tag_id_idx` (`tag_id`),
  KEY `fk_purchase_id_idx` (`purchase_id`),
  CONSTRAINT `fk_purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
  `entity_display` varchar(200) DEFAULT NULL,
  `ka_id` varchar(45) DEFAULT NULL,
  `maker` int(11) NOT NULL,
  `vendor` int(11) NOT NULL,
  `price` decimal(13,2) NOT NULL,
  `adjustments` decimal(13,2) NOT NULL,
  `saleType` int(11) NOT NULL,
  `received` tinyint(4) NOT NULL,
  `purchaseDate` date NOT NULL,
  `receivedDate` date NOT NULL,
  `soldDate` date DEFAULT '1971-01-01',
  `salePrice` decimal(13,2) DEFAULT -1.00,
  `isSold` tinyint(4) DEFAULT 0,
  `willSell` tinyint(4) DEFAULT 1,
  `orderSet` int(11) NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `image_local` varchar(1000) DEFAULT NULL,
  `series_num` int(11) NOT NULL DEFAULT 1,
  `series_total` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `category_idx` (`category`),
  KEY `maker_idx` (`maker`),
  KEY `vendor_idx` (`vendor`),
  KEY `saleType_idx` (`saleType`),
  CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `maker` FOREIGN KEY (`maker`) REFERENCES `makers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `saleType` FOREIGN KEY (`saleType`) REFERENCES `sale_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `vendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=617 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tagname` varchar(45) NOT NULL,
  `purchaseid` int(5) NOT NULL,
  PRIMARY KEY (`id`,`tagname`),
  UNIQUE KEY `idtags_UNIQUE` (`id`),
  KEY `purchaseid_fk_idx` (`purchaseid`),
  CONSTRAINT `purchaseid_fk` FOREIGN KEY (`purchaseid`) REFERENCES `purchases` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=450 DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Current Database: `keyboard`
--

USE `keyboard`;

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
/*!50001 VIEW `all_purchases` AS select `p`.`id` AS `id`,`c`.`id` AS `category_id`,`c`.`display_name` AS `category_name`,`p`.`detail` AS `detail`,`p`.`entity` AS `entity`,`p`.`entity_display` AS `sculpt`,`p`.`ka_id` AS `ka_id`,`m`.`display_name` AS `maker_name`,`m`.`id` AS `maker_id`,`m`.`instagram` AS `instagram`,`m`.`archivist_name` AS `archivist`,`v`.`display_name` AS `vendor_name`,`v`.`id` AS `vendor_id`,`v`.`link` AS `link`,`p`.`price` AS `price`,`p`.`adjustments` AS `adjustments`,`p`.`price` + `p`.`adjustments` AS `total`,`p`.`series_num` AS `series_num`,`p`.`series_total` AS `series_total`,`s`.`id` AS `sale_id`,`s`.`display_name` AS `sale_type`,`p`.`soldDate` AS `soldDate`,`p`.`salePrice` AS `salePrice`,`p`.`isSold` AS `isSold`,`p`.`willSell` AS `willSell`,`p`.`received` AS `received`,`p`.`purchaseDate` AS `purchaseDate`,`p`.`receivedDate` AS `receivedDate`,`p`.`orderSet` AS `orderSet`,`p`.`notes` AS `notes`,`p`.`image` AS `image`,group_concat(`t`.`tagname` separator ',') AS `tags` from (((((`purchases` `p` left join `categories` `c` on(`c`.`id` = `p`.`category`)) left join `makers` `m` on(`m`.`id` = `p`.`maker`)) left join `vendors` `v` on(`v`.`id` = `p`.`vendor`)) left join `sale_types` `s` on(`s`.`id` = `p`.`saleType`)) left join `tags` `t` on(`t`.`purchaseid` = `p`.`id`)) group by `p`.`id` */;
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

-- Dump completed on 2022-06-20 20:33:50