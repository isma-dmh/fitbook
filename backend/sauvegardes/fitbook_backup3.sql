-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: fitbook
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activite`
--

DROP TABLE IF EXISTS `activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `description` longtext,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite`
--

LOCK TABLES `activite` WRITE;
/*!40000 ALTER TABLE `activite` DISABLE KEYS */;
INSERT INTO `activite` VALUES (3,'Yoga','DU YOGA','2026-11-02 19:37:38','2026-11-02 19:37:38'),(4,'Basket','DU BASKET','2026-11-02 19:37:53','2026-11-02 19:37:53'),(5,'Yoga','Postures, respiration et relaxation.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(6,'Pilates','Renforcement profond et gainage.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(7,'CrossFit','Entraînement fonctionnel intensif.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(8,'Boxe','Technique et cardio en gants.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(9,'Musculation','Travail de la force avec charges.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(10,'Spinning','Cours collectif de vélo en musique.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(11,'Natation','Perfectionnement et endurance en bassin.','2026-11-03 02:26:23','2026-11-03 02:26:23'),(12,'Zumba','Danse fitness énergique.','2026-11-03 02:26:23','2026-11-03 02:26:23');
/*!40000 ALTER TABLE `activite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` int NOT NULL,
  `commentaire` longtext,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `utilisateur_id` int NOT NULL,
  `salle_id` int DEFAULT NULL,
  `profil_coach_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8F91ABF0FB88E14F` (`utilisateur_id`),
  KEY `IDX_8F91ABF0DC304035` (`salle_id`),
  KEY `IDX_8F91ABF020F9233C` (`profil_coach_id`),
  CONSTRAINT `FK_8F91ABF020F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`),
  CONSTRAINT `FK_8F91ABF0DC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`),
  CONSTRAINT `FK_8F91ABF0FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
INSERT INTO `avis` VALUES (1,4,'test avis salle 1 ','2026-11-03 02:15:21','2026-11-03 02:15:21',4,1,NULL),(2,2,'test avis coach ','2026-11-03 02:16:58','2026-11-03 02:16:58',4,NULL,1),(3,4,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',14,3,NULL),(4,3,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,NULL,4),(5,4,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,7,NULL),(6,4,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,NULL,5),(7,4,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,4,NULL),(8,5,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,NULL,6),(9,5,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',14,NULL,7),(10,3,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',14,5,NULL),(11,4,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',15,NULL,3),(12,4,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',15,8,NULL),(13,5,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',15,NULL,4),(14,5,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',15,2,NULL),(15,4,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',15,5,NULL),(16,4,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,NULL,3),(17,4,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,3,NULL),(18,5,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,NULL,4),(19,3,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,7,NULL),(20,3,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,NULL,5),(21,3,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',16,4,NULL),(22,5,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,6,NULL),(23,3,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,NULL,7),(24,3,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',16,5,NULL),(25,3,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',17,8,NULL),(26,4,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',17,NULL,4),(27,5,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',17,2,NULL),(28,3,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',17,NULL,5),(29,3,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',17,5,NULL),(30,4,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',17,NULL,6),(31,3,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,NULL,3),(32,4,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,3,NULL),(33,5,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',18,NULL,4),(34,4,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,7,NULL),(35,5,'Un peu intense pour moi mais très efficace.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,NULL,5),(36,5,'Coach à l\'écoute et vestiaires propres.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,4,NULL),(37,3,'Bon rapport qualité/prix.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,NULL,6),(38,5,'Matériel récent et salle spacieuse.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,6,NULL),(39,5,'Super séance, très bien encadrée !','2026-11-03 02:26:23','2026-11-03 02:26:23',18,5,NULL),(40,3,'Ambiance agréable, je reviendrai sans hésiter.','2026-11-03 02:26:23','2026-11-03 02:26:23',18,NULL,7);
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disponibilite`
--

DROP TABLE IF EXISTS `disponibilite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_dispo` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `type` varchar(20) NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `profil_coach_id` int DEFAULT NULL,
  `salle_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2CBACE2F20F9233C` (`profil_coach_id`),
  KEY `IDX_2CBACE2FDC304035` (`salle_id`),
  CONSTRAINT `FK_2CBACE2F20F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`),
  CONSTRAINT `FK_2CBACE2FDC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disponibilite`
--

LOCK TABLES `disponibilite` WRITE;
/*!40000 ALTER TABLE `disponibilite` DISABLE KEYS */;
INSERT INTO `disponibilite` VALUES (1,'2026-11-06','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',3,NULL),(2,'2026-11-08','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',3,NULL),(3,'2026-11-12','14:00:00','16:00:00','bloque','2026-11-03 02:26:23','2026-11-03 02:26:23',3,NULL),(4,'2026-11-06','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',4,NULL),(5,'2026-11-08','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',4,NULL),(6,'2026-11-12','14:00:00','16:00:00','bloque','2026-11-03 02:26:23','2026-11-03 02:26:23',4,NULL),(7,'2026-11-06','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',5,NULL),(8,'2026-11-08','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',5,NULL),(9,'2026-11-12','14:00:00','16:00:00','bloque','2026-11-03 02:26:23','2026-11-03 02:26:23',5,NULL),(10,'2026-11-06','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',6,NULL),(11,'2026-11-08','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',6,NULL),(12,'2026-11-12','14:00:00','16:00:00','bloque','2026-11-03 02:26:23','2026-11-03 02:26:23',6,NULL),(13,'2026-11-06','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',7,NULL),(14,'2026-11-08','14:00:00','16:00:00','disponible','2026-11-03 02:26:23','2026-11-03 02:26:23',7,NULL),(15,'2026-11-12','14:00:00','16:00:00','bloque','2026-11-03 02:26:23','2026-11-03 02:26:23',7,NULL);
/*!40000 ALTER TABLE `disponibilite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20261027155341','2026-10-27 15:55:02',140),('DoctrineMigrations\\Version20261027163406','2026-10-27 16:34:54',153),('DoctrineMigrations\\Version20261027171013','2026-10-27 17:13:55',1102),('DoctrineMigrations\\Version20261029131859','2026-10-29 13:19:41',461),('DoctrineMigrations\\Version20261029141435','2026-10-29 14:15:05',1401),('DoctrineMigrations\\Version20261029145126','2026-10-29 14:55:11',7),('DoctrineMigrations\\Version20261029163024','2026-10-29 16:39:22',123),('DoctrineMigrations\\Version20261103034500','2026-11-03 03:47:37',86);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipement`
--

DROP TABLE IF EXISTS `equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipement`
--

LOCK TABLES `equipement` WRITE;
/*!40000 ALTER TABLE `equipement` DISABLE KEYS */;
INSERT INTO `equipement` VALUES (1,'tapis'),(2,'haltere'),(3,'machine'),(4,'Douches'),(5,'Vestiaires'),(6,'Parking'),(7,'Wifi'),(8,'Sauna'),(9,'Tapis de course'),(10,'Haltères'),(11,'Casiers');
/*!40000 ALTER TABLE `equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire_coach`
--

DROP TABLE IF EXISTS `horaire_coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire_coach` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jour_semaine` int NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `profil_coach_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_5AB1DA1720F9233C` (`profil_coach_id`),
  CONSTRAINT `FK_5AB1DA1720F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire_coach`
--

LOCK TABLES `horaire_coach` WRITE;
/*!40000 ALTER TABLE `horaire_coach` DISABLE KEYS */;
INSERT INTO `horaire_coach` VALUES (1,1,'09:00:00','19:00:00',3),(2,2,'09:00:00','19:00:00',3),(3,3,'09:00:00','19:00:00',3),(4,4,'09:00:00','19:00:00',3),(5,5,'09:00:00','19:00:00',3),(6,1,'09:00:00','19:00:00',4),(7,2,'09:00:00','19:00:00',4),(8,3,'09:00:00','19:00:00',4),(9,4,'09:00:00','19:00:00',4),(10,5,'09:00:00','19:00:00',4),(11,1,'09:00:00','19:00:00',5),(12,2,'09:00:00','19:00:00',5),(13,3,'09:00:00','19:00:00',5),(14,4,'09:00:00','19:00:00',5),(15,5,'09:00:00','19:00:00',5),(16,1,'09:00:00','19:00:00',6),(17,2,'09:00:00','19:00:00',6),(18,3,'09:00:00','19:00:00',6),(19,4,'09:00:00','19:00:00',6),(20,5,'09:00:00','19:00:00',6),(21,1,'09:00:00','19:00:00',7),(22,2,'09:00:00','19:00:00',7),(23,3,'09:00:00','19:00:00',7),(24,4,'09:00:00','19:00:00',7),(25,5,'09:00:00','19:00:00',7);
/*!40000 ALTER TABLE `horaire_coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire_salle`
--

DROP TABLE IF EXISTS `horaire_salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire_salle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jour_semaine` int NOT NULL,
  `heure_ouverture` time NOT NULL,
  `heure_fermeture` time NOT NULL,
  `salle_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2B7FC987DC304035` (`salle_id`),
  CONSTRAINT `FK_2B7FC987DC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire_salle`
--

LOCK TABLES `horaire_salle` WRITE;
/*!40000 ALTER TABLE `horaire_salle` DISABLE KEYS */;
INSERT INTO `horaire_salle` VALUES (1,1,'07:00:00','22:00:00',2),(2,2,'07:00:00','22:00:00',2),(3,3,'07:00:00','22:00:00',2),(4,4,'07:00:00','22:00:00',2),(5,5,'07:00:00','22:00:00',2),(6,6,'07:00:00','22:00:00',2),(7,7,'09:00:00','18:00:00',2),(8,1,'07:00:00','22:00:00',3),(9,2,'07:00:00','22:00:00',3),(10,3,'07:00:00','22:00:00',3),(11,4,'07:00:00','22:00:00',3),(12,5,'07:00:00','22:00:00',3),(13,6,'07:00:00','22:00:00',3),(14,7,'09:00:00','18:00:00',3),(15,1,'07:00:00','22:00:00',4),(16,2,'07:00:00','22:00:00',4),(17,3,'07:00:00','22:00:00',4),(18,4,'07:00:00','22:00:00',4),(19,5,'07:00:00','22:00:00',4),(20,6,'07:00:00','22:00:00',4),(21,7,'09:00:00','18:00:00',4),(22,1,'07:00:00','22:00:00',5),(23,2,'07:00:00','22:00:00',5),(24,3,'07:00:00','22:00:00',5),(25,4,'07:00:00','22:00:00',5),(26,5,'07:00:00','22:00:00',5),(27,6,'07:00:00','22:00:00',5),(28,7,'09:00:00','18:00:00',5),(29,1,'07:00:00','22:00:00',6),(30,2,'07:00:00','22:00:00',6),(31,3,'07:00:00','22:00:00',6),(32,4,'07:00:00','22:00:00',6),(33,5,'07:00:00','22:00:00',6),(34,6,'07:00:00','22:00:00',6),(35,7,'09:00:00','18:00:00',6),(36,1,'07:00:00','22:00:00',7),(37,2,'07:00:00','22:00:00',7),(38,3,'07:00:00','22:00:00',7),(39,4,'07:00:00','22:00:00',7),(40,5,'07:00:00','22:00:00',7),(41,6,'07:00:00','22:00:00',7),(42,7,'09:00:00','18:00:00',7),(43,1,'07:00:00','22:00:00',8),(44,2,'07:00:00','22:00:00',8),(45,3,'07:00:00','22:00:00',8),(46,4,'07:00:00','22:00:00',8),(47,5,'07:00:00','22:00:00',8),(48,6,'07:00:00','22:00:00',8),(49,7,'09:00:00','18:00:00',8);
/*!40000 ALTER TABLE `horaire_salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo_salle`
--

DROP TABLE IF EXISTS `photo_salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo_salle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `date_creation` datetime NOT NULL,
  `salle_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_F4C679EBDC304035` (`salle_id`),
  CONSTRAINT `FK_F4C679EBDC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo_salle`
--

LOCK TABLES `photo_salle` WRITE;
/*!40000 ALTER TABLE `photo_salle` DISABLE KEYS */;
INSERT INTO `photo_salle` VALUES (1,'images-6ae8f99d0e4c0626556046.jpg','2026-11-02 20:59:09',1);
/*!40000 ALTER TABLE `photo_salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil_coach`
--

DROP TABLE IF EXISTS `profil_coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil_coach` (
  `id` int NOT NULL AUTO_INCREMENT,
  `presentation` longtext NOT NULL,
  `specialites` varchar(255) NOT NULL,
  `tarif_horaire` double NOT NULL,
  `ville` varchar(255) NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `utilisateur_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_7155B688FB88E14F` (`utilisateur_id`),
  CONSTRAINT `FK_7155B688FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil_coach`
--

LOCK TABLES `profil_coach` WRITE;
/*!40000 ALTER TABLE `profil_coach` DISABLE KEYS */;
INSERT INTO `profil_coach` VALUES (1,'testcoach','yoga',100,'Bruxelles','2026-11-02 11:48:33','2026-11-02 11:48:33',5),(3,'Professeure de yoga depuis 8 ans, j\'accompagne tous les niveaux vers plus de souplesse et de sérénité.','Yoga, Pilates',35,'Bruxelles','2026-11-03 02:26:23','2026-11-03 13:01:50',19),(4,'Ancien boxeur amateur, je propose des séances intenses et techniques pour se dépasser.','Boxe, CrossFit',45,'Gand','2026-11-03 02:26:23','2026-11-03 02:26:23',20),(5,'Coach sportive diplômée, spécialisée dans la remise en forme et la prise de masse progressive.','Musculation, Zumba',40,'Liège','2026-11-03 02:26:23','2026-11-03 02:26:23',21),(6,'Passionné d\'endurance, je prépare aussi bien les débutants que les triathlètes.','Spinning, Natation',38,'Charleroi','2026-11-03 02:26:23','2026-11-03 02:26:23',22),(7,'Kinésithérapeute de formation, je mets l\'accent sur la posture et la prévention des blessures.','Pilates, Yoga',32,'Namur','2026-11-03 02:26:23','2026-11-03 02:26:23',23);
/*!40000 ALTER TABLE `profil_coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil_coach_salle`
--

DROP TABLE IF EXISTS `profil_coach_salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil_coach_salle` (
  `profil_coach_id` int NOT NULL,
  `salle_id` int NOT NULL,
  PRIMARY KEY (`profil_coach_id`,`salle_id`),
  KEY `IDX_2B043620F9233C` (`profil_coach_id`),
  KEY `IDX_2B0436DC304035` (`salle_id`),
  CONSTRAINT `FK_2B043620F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_2B0436DC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil_coach_salle`
--

LOCK TABLES `profil_coach_salle` WRITE;
/*!40000 ALTER TABLE `profil_coach_salle` DISABLE KEYS */;
INSERT INTO `profil_coach_salle` VALUES (3,3),(3,8),(4,2),(4,7),(5,4),(5,5),(6,2),(6,6),(7,5),(7,8);
/*!40000 ALTER TABLE `profil_coach_salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statut` varchar(30) NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `utilisateur_id` int NOT NULL,
  `seance_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_42C84955FB88E14F` (`utilisateur_id`),
  KEY `IDX_42C84955E3797A94` (`seance_id`),
  CONSTRAINT `FK_42C84955E3797A94` FOREIGN KEY (`seance_id`) REFERENCES `seance` (`id`),
  CONSTRAINT `FK_42C84955FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,'annulee','2026-11-02 21:05:34','2026-11-02 21:16:41',4,1),(2,'confirmee','2026-11-03 01:06:03','2026-11-03 01:06:03',4,1),(3,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,3),(4,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,7),(5,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,11),(6,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,15),(7,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,19),(8,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,23),(9,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,27),(10,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,31),(11,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,35),(12,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,39),(13,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,43),(14,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,47),(15,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,51),(16,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,55),(17,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',14,59),(18,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,4),(19,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,8),(20,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,12),(21,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,16),(22,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,20),(23,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,24),(24,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,28),(25,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,32),(26,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,36),(27,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,40),(28,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,44),(29,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,48),(30,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,52),(31,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,56),(32,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',15,60),(33,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,5),(34,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,9),(35,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,17),(36,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,21),(37,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,25),(38,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,29),(39,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,33),(40,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,41),(41,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,45),(42,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,49),(43,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,53),(44,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',16,57),(45,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,6),(46,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,10),(47,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,14),(48,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,18),(49,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,22),(50,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,26),(51,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,30),(52,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,34),(53,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,38),(54,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,42),(55,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,46),(56,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,50),(57,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,54),(58,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,58),(59,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',17,62),(60,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,3),(61,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,7),(62,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,11),(63,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,15),(64,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,19),(65,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,23),(66,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,27),(67,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,31),(68,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,35),(69,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,39),(70,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,43),(71,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,47),(72,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,51),(73,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,55),(74,'confirmee','2026-11-03 02:26:23','2026-11-03 02:26:23',18,59),(75,'annulee','2026-11-03 03:02:42','2026-11-03 03:07:34',14,20);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_password_request`
--

DROP TABLE IF EXISTS `reset_password_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_password_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `selector` varchar(20) NOT NULL,
  `hashed_token` varchar(100) NOT NULL,
  `requested_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_7CE748AA76ED395` (`user_id`),
  CONSTRAINT `FK_7CE748AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_password_request`
--

LOCK TABLES `reset_password_request` WRITE;
/*!40000 ALTER TABLE `reset_password_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_password_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'sportif'),(2,'coach'),(3,'salle'),(4,'administrateur');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `capacite_max` int NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `gestionnaire_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_4E977E5C6885AC1B` (`gestionnaire_id`),
  CONSTRAINT `FK_4E977E5C6885AC1B` FOREIGN KEY (`gestionnaire_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle`
--

LOCK TABLES `salle` WRITE;
/*!40000 ALTER TABLE `salle` DISABLE KEYS */;
INSERT INTO `salle` VALUES (1,'salle1','Rue Salle 1','Bruxelles','fjslkjfdslkjfdslkjlkdsjdslkfds',50,'2026-11-02 14:40:05','2026-11-02 19:39:28',6),(2,'Fit Center Bruxelles','Rue Neuve 12','Bruxelles','Fit Center Bruxelles : un espace convivial à Bruxelles avec un encadrement de qualité et du matériel récent.',40,'2026-11-03 02:26:23','2026-11-03 02:26:23',9),(3,'Zen Studio','Avenue Louise 150','Bruxelles','Zen Studio : un espace convivial à Bruxelles avec un encadrement de qualité et du matériel récent.',20,'2026-11-03 02:26:23','2026-11-03 13:00:07',9),(4,'Liège Gym Club','Boulevard de la Sauvenière 8','Liège','Liège Gym Club : un espace convivial à Liège avec un encadrement de qualité et du matériel récent.',35,'2026-11-03 02:26:23','2026-11-03 02:26:23',10),(5,'Namur Active','Rue de Fer 21','Namur','Namur Active : un espace convivial à Namur avec un encadrement de qualité et du matériel récent.',25,'2026-11-03 02:26:23','2026-11-03 02:26:23',11),(6,'Aqua Sport Charleroi','Place Charles II 3','Charleroi','Aqua Sport Charleroi : un espace convivial à Charleroi avec un encadrement de qualité et du matériel récent.',30,'2026-11-03 02:26:23','2026-11-03 02:26:23',12),(7,'Box & Fit Gand','Veldstraat 45','Gand','Box & Fit Gand : un espace convivial à Gand avec un encadrement de qualité et du matériel récent.',28,'2026-11-03 02:26:23','2026-11-03 02:26:23',13),(8,'Louvain Wellness','Naamsestraat 60','Louvain','Louvain Wellness : un espace convivial à Louvain avec un encadrement de qualité et du matériel récent.',22,'2026-11-03 02:26:23','2026-11-03 02:26:23',13);
/*!40000 ALTER TABLE `salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle_activite`
--

DROP TABLE IF EXISTS `salle_activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle_activite` (
  `salle_id` int NOT NULL,
  `activite_id` int NOT NULL,
  PRIMARY KEY (`salle_id`,`activite_id`),
  KEY `IDX_A434021BDC304035` (`salle_id`),
  KEY `IDX_A434021B9B0F88B1` (`activite_id`),
  CONSTRAINT `FK_A434021B9B0F88B1` FOREIGN KEY (`activite_id`) REFERENCES `activite` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_A434021BDC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle_activite`
--

LOCK TABLES `salle_activite` WRITE;
/*!40000 ALTER TABLE `salle_activite` DISABLE KEYS */;
INSERT INTO `salle_activite` VALUES (1,3),(2,7),(2,9),(2,10),(3,5),(3,6),(4,8),(4,9),(4,12),(5,5),(5,6),(5,12),(6,10),(6,11),(7,7),(7,8),(7,9),(8,5),(8,6),(8,10);
/*!40000 ALTER TABLE `salle_activite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle_equipement`
--

DROP TABLE IF EXISTS `salle_equipement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle_equipement` (
  `salle_id` int NOT NULL,
  `equipement_id` int NOT NULL,
  PRIMARY KEY (`salle_id`,`equipement_id`),
  KEY `IDX_D338336BDC304035` (`salle_id`),
  KEY `IDX_D338336B806F0F5C` (`equipement_id`),
  CONSTRAINT `FK_D338336B806F0F5C` FOREIGN KEY (`equipement_id`) REFERENCES `equipement` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_D338336BDC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle_equipement`
--

LOCK TABLES `salle_equipement` WRITE;
/*!40000 ALTER TABLE `salle_equipement` DISABLE KEYS */;
INSERT INTO `salle_equipement` VALUES (1,1),(2,4),(2,5),(2,7),(2,9),(2,10),(3,5),(3,7),(3,11),(4,4),(4,6),(4,8),(4,10),(5,4),(5,5),(5,6),(6,4),(6,5),(6,8),(6,11),(7,4),(7,6),(7,7),(7,10),(8,5),(8,7),(8,8);
/*!40000 ALTER TABLE `salle_equipement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seance`
--

DROP TABLE IF EXISTS `seance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_seance` date NOT NULL,
  `heure_debut` time NOT NULL,
  `duree_minutes` int NOT NULL,
  `capacite` int NOT NULL,
  `prix` double NOT NULL,
  `statut` varchar(30) NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `activite_id` int NOT NULL,
  `profil_coach_id` int DEFAULT NULL,
  `salle_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_DF7DFD0E9B0F88B1` (`activite_id`),
  KEY `IDX_DF7DFD0E20F9233C` (`profil_coach_id`),
  KEY `IDX_DF7DFD0EDC304035` (`salle_id`),
  CONSTRAINT `FK_DF7DFD0E20F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`),
  CONSTRAINT `FK_DF7DFD0E9B0F88B1` FOREIGN KEY (`activite_id`) REFERENCES `activite` (`id`),
  CONSTRAINT `FK_DF7DFD0EDC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seance`
--

LOCK TABLES `seance` WRITE;
/*!40000 ALTER TABLE `seance` DISABLE KEYS */;
INSERT INTO `seance` VALUES (1,'2026-11-03','02:07:00',60,3,7.5,'planifiee','2026-11-02 21:04:26','2026-11-03 01:04:55',3,1,1),(2,'2026-10-31','22:22:00',60,10,0,'planifiee','2026-11-02 21:17:50','2026-11-02 21:17:50',4,1,1),(3,'2026-10-13','08:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(4,'2026-10-20','10:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(5,'2026-10-25','12:30:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(6,'2026-10-29','17:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(7,'2026-11-01','19:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(8,'2026-11-04','08:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(9,'2026-11-05','10:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(10,'2026-11-07','12:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(11,'2026-11-09','17:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(12,'2026-11-11','19:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(13,'2026-11-14','08:00:00',60,12,12,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,3,3),(14,'2026-11-17','10:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,3,8),(15,'2026-10-13','10:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(16,'2026-10-20','12:30:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(17,'2026-10-25','17:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(18,'2026-10-29','19:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(19,'2026-11-01','08:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(20,'2026-11-04','10:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(21,'2026-11-05','12:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(22,'2026-11-07','17:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(23,'2026-11-09','19:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(24,'2026-11-11','08:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(25,'2026-11-14','10:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',8,4,7),(26,'2026-11-17','12:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',7,4,2),(27,'2026-10-13','12:30:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(28,'2026-10-20','17:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(29,'2026-10-25','19:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(30,'2026-10-29','08:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(31,'2026-11-01','10:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(32,'2026-11-04','12:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(33,'2026-11-05','17:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(34,'2026-11-07','19:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(35,'2026-11-09','08:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(36,'2026-11-11','10:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(37,'2026-11-14','12:30:00',45,8,8,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',9,5,4),(38,'2026-11-17','17:30:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',12,5,5),(39,'2026-10-13','17:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(40,'2026-10-20','19:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(41,'2026-10-25','08:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(42,'2026-10-29','10:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(43,'2026-11-01','12:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(44,'2026-11-04','17:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(45,'2026-11-05','19:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(46,'2026-11-07','08:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(47,'2026-11-09','10:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(48,'2026-11-11','12:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(49,'2026-11-14','17:30:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',10,6,6),(50,'2026-11-17','19:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',11,6,2),(51,'2026-10-13','19:00:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(52,'2026-10-20','08:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8),(53,'2026-10-25','10:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(54,'2026-10-29','12:30:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8),(55,'2026-11-01','17:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(56,'2026-11-04','19:00:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8),(57,'2026-11-05','08:00:00',60,12,12,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(58,'2026-11-07','10:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8),(59,'2026-11-09','12:30:00',45,8,8,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(60,'2026-11-11','17:30:00',60,10,10,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8),(61,'2026-11-14','19:00:00',60,12,12,'annulee','2026-11-03 02:26:23','2026-11-03 02:26:23',6,7,5),(62,'2026-11-17','08:00:00',90,15,15,'planifiee','2026-11-03 02:26:23','2026-11-03 02:26:23',5,7,8);
/*!40000 ALTER TABLE `seance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `objectifs` longtext,
  `niveau` varchar(50) DEFAULT NULL,
  `email_verifie` tinyint NOT NULL,
  `actif` tinyint NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`),
  KEY `IDX_1D1C63B3D60322AC` (`role_id`),
  CONSTRAINT `FK_1D1C63B3D60322AC` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (3,'test@gmail.com','$2y$13$09pt2L/g8g/IRByIoBudWOpk06piZ0HY5UyZUOuChbpErtR6YEO/W','Test1','Test1',NULL,NULL,NULL,1,1,'2026-10-30 21:43:21','2026-11-03 12:34:13',1),(4,'test2@gmail.com','$2y$13$M87ZlJkuLQCsrA9AZQcf1e5TRRJXtsdX4ALlV5zC1fgJEYrwkgRvW','test','test','images-6ae8fa0f30b5a140488435.jpg',NULL,NULL,1,1,'2026-11-02 11:35:22','2026-11-02 21:16:54',1),(5,'testcoach@gmail.com','$2y$13$o7hBRNNX4liqmLkzuaWt5ejYYbbl5/pwjZ11IyisDsOXP3rMgYinO','coach','test','pngtree-man-profile-account-picture-character-png-image-14599291-6ae8e4fbac56d125063301.png',NULL,NULL,1,1,'2026-11-02 11:37:23','2026-11-02 19:31:07',2),(6,'testSalle@gmail.com','$2y$13$.N/eDWE2CPQr6ajyc8Kw/enGq1wVCc4tq3kvJ1n0C9hr9rIbeEPD.','salle','test',NULL,NULL,NULL,1,1,'2026-11-02 14:18:09','2026-11-02 14:19:43',3),(7,'testAdmin@gmail.com','$2y$13$ddS9b085AeJA/wbKH5g8k.uf6CMgwFsBDQz.w95CHH.y.bQHG6p0G','admin','test',NULL,NULL,NULL,1,1,'2026-11-02 19:35:24','2026-11-03 12:34:38',4),(8,'admin@fitbook.test','$2y$13$PtGZU4sUCTp6EGiFoRxQHOz3dhLbaAPX49VRL56GNXH01QEW89Dci','Admin','Fitbook',NULL,NULL,NULL,1,1,'2026-11-03 02:26:12','2026-11-03 02:26:12',4),(9,'salle1@fitbook.test','$2y$13$btlOU/72Wvm3raxlfRCecO8iVKGe0MEv932JK8OHnPejpH7bmcoxa','Dubois','Marc',NULL,NULL,NULL,1,1,'2026-11-03 02:26:13','2026-11-03 02:26:13',3),(10,'salle2@fitbook.test','$2y$13$bDfB5PLnQRkeyDM6IZZYGu7D4dRSZ5ewKDcGTdtIUcgS1Z6YRN4Ni','Lambert','Sophie',NULL,NULL,NULL,1,1,'2026-11-03 02:26:14','2026-11-03 02:26:14',3),(11,'salle3@fitbook.test','$2y$13$XS5EdGWuxBnG57cIHBjf1OSfEF.7inpSLzpvl7JEsRhD3kWphGkL2','Renard','Julien',NULL,NULL,NULL,1,1,'2026-11-03 02:26:14','2026-11-03 02:26:14',3),(12,'salle4@fitbook.test','$2y$13$bz9HrXtgXh/t8s/pn5G./evZty8n9OvLzzHyzp5wLj1A6Tkk5G7Rm','Maes','Elise',NULL,NULL,NULL,1,1,'2026-11-03 02:26:15','2026-11-03 02:26:15',3),(13,'salle5@fitbook.test','$2y$13$up8C/4Y4qLBvye0IxXNXp.5ExLlHBC0p.EHiLx0pHq5YAlShMLNSu','Peeters','Thomas',NULL,NULL,NULL,1,1,'2026-11-03 02:26:16','2026-11-03 02:26:16',3),(14,'sportif1@fitbook.test','$2y$13$K2U7p64M2C34GmmLj7BoruON2nnLbQIBVsuBkS1JWlgYBV3wfjJfe','Janssens','Léa',NULL,'Perdre du poids','debutant',1,1,'2026-11-03 02:26:16','2026-11-03 02:26:16',1),(15,'sportif2@fitbook.test','$2y$13$b1oYO3/DLpI5gVdWLMOfYueC5Mu2LLQtqKSFGctyahOARiClnywly','Martin','Hugo',NULL,'Prendre du muscle','intermediaire',1,1,'2026-11-03 02:26:17','2026-11-03 02:26:17',1),(16,'sportif3@fitbook.test','$2y$13$LtKla.nWDO/2CPPUlK3ECu.Cmfp3XzYaXpRP2ovs9EDTgksAzEWNq','Claes','Nina',NULL,'Améliorer mon endurance','avance',1,1,'2026-11-03 02:26:18','2026-11-03 02:26:18',1),(17,'sportif4@fitbook.test','$2y$13$mMnWg2e55cGrHrP0PhRrPuMGkUCHMq4W7visVCGmCIbQwA0zm1SwG','Vandenberg','Adam',NULL,'Gagner en souplesse','debutant',1,1,'2026-11-03 02:26:18','2026-11-03 02:26:18',1),(18,'sportif5@fitbook.test','$2y$13$mXOYx132NZswU1nDXahoVObRBjZACAslPwCVztJRKixN4aXX0H92K','Moreau','Inès',NULL,'Me défouler après le travail','intermediaire',1,1,'2026-11-03 02:26:19','2026-11-03 02:26:19',1),(19,'coach1@fitbook.test','$2y$13$yXSUUZEKgIbg7bQp61J5QegMXX68Ws469ai8/a7Fp1eOnXvOYXMNC','Bernard','Camille',NULL,NULL,NULL,1,1,'2026-11-03 02:26:20','2026-11-03 02:26:20',2),(20,'coach2@fitbook.test','$2y$13$IyJYmbOiHaNCdFwNnJAvgOCLP2xbeMGv6IKfCU98Jxapdsj4fTbaO','Dupont','Karim',NULL,NULL,NULL,1,1,'2026-11-03 02:26:20','2026-11-03 02:26:20',2),(21,'coach3@fitbook.test','$2y$13$zZXY6QnZFOFgFVrWSmUk1.HpszEQfa/lEAQSU7M7xFCMg1QSB2Fa6','Goossens','Laura',NULL,NULL,NULL,1,1,'2026-11-03 02:26:21','2026-11-03 02:26:21',2),(22,'coach4@fitbook.test','$2y$13$mj4.HnRMrZRTYkSHqplUR.WS2x0bGhhHi.7lWWoaljT/v5FMlLna2','Leroy','Nicolas',NULL,NULL,NULL,1,1,'2026-11-03 02:26:22','2026-11-03 02:26:22',2),(23,'coach5@fitbook.test','$2y$13$TC4.Ifbvh8Iz9QN2etsv2uKpDhhXMgXc/4xDZwZM/9qM.uljhHjnu','Simon','Amélie',NULL,NULL,NULL,1,1,'2026-11-03 02:26:23','2026-11-03 02:26:23',2),(24,'coach.newman.1793708787052@fitbook.test','$2y$13$EiTa1m3eNkco42q8DrGrAOrE/iVVkSVCufqzlzkaHlzdeG.o6JUPK','Newman','Coach',NULL,NULL,NULL,0,1,'2026-11-03 13:26:31','2026-11-03 13:26:31',2),(25,'coach.newman.1793708893309@fitbook.test','$2y$13$qWC8PBIN9UDQfTj/u7JWQOAGPWxjRVA1QA6WJ0VsmgZNVHMzon1me','Newman','Coach',NULL,NULL,NULL,0,1,'2026-11-03 13:28:15','2026-11-03 13:28:15',2),(26,'coach.newman.1793708974832@fitbook.test','$2y$13$0zFcdu9JKgi74QdL4GUtzuGaemBEUzsa.I1jdkzdo2DOlojgLOsGO','Newman','Coach',NULL,NULL,NULL,0,1,'2026-11-03 13:29:37','2026-11-03 13:29:37',2),(27,'coach.newman.1793709093840@fitbook.test','$2y$13$InKfzJdbPMGwf207fQECZOTLx1WNpqX0DNh0pAFkEG4t0HA7EFOvu','Newman','Coach',NULL,NULL,NULL,0,1,'2026-11-03 13:31:36','2026-11-03 13:31:36',2);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_profil_coach`
--

DROP TABLE IF EXISTS `utilisateur_profil_coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_profil_coach` (
  `utilisateur_id` int NOT NULL,
  `profil_coach_id` int NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`profil_coach_id`),
  KEY `IDX_18A7927BFB88E14F` (`utilisateur_id`),
  KEY `IDX_18A7927B20F9233C` (`profil_coach_id`),
  CONSTRAINT `FK_18A7927B20F9233C` FOREIGN KEY (`profil_coach_id`) REFERENCES `profil_coach` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_18A7927BFB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_profil_coach`
--

LOCK TABLES `utilisateur_profil_coach` WRITE;
/*!40000 ALTER TABLE `utilisateur_profil_coach` DISABLE KEYS */;
INSERT INTO `utilisateur_profil_coach` VALUES (4,1),(14,3),(14,4),(15,4),(15,5),(16,5),(16,6),(17,6),(17,7),(18,3),(18,7);
/*!40000 ALTER TABLE `utilisateur_profil_coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_salle`
--

DROP TABLE IF EXISTS `utilisateur_salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_salle` (
  `utilisateur_id` int NOT NULL,
  `salle_id` int NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`salle_id`),
  KEY `IDX_88522682FB88E14F` (`utilisateur_id`),
  KEY `IDX_88522682DC304035` (`salle_id`),
  CONSTRAINT `FK_88522682DC304035` FOREIGN KEY (`salle_id`) REFERENCES `salle` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_88522682FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_salle`
--

LOCK TABLES `utilisateur_salle` WRITE;
/*!40000 ALTER TABLE `utilisateur_salle` DISABLE KEYS */;
INSERT INTO `utilisateur_salle` VALUES (4,1),(14,2),(14,4),(15,3),(15,5),(16,4),(16,6),(17,5),(17,7),(18,6),(18,8);
/*!40000 ALTER TABLE `utilisateur_salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_seance`
--

DROP TABLE IF EXISTS `utilisateur_seance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_seance` (
  `utilisateur_id` int NOT NULL,
  `seance_id` int NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`seance_id`),
  KEY `IDX_BED0C785FB88E14F` (`utilisateur_id`),
  KEY `IDX_BED0C785E3797A94` (`seance_id`),
  CONSTRAINT `FK_BED0C785E3797A94` FOREIGN KEY (`seance_id`) REFERENCES `seance` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_BED0C785FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_seance`
--

LOCK TABLES `utilisateur_seance` WRITE;
/*!40000 ALTER TABLE `utilisateur_seance` DISABLE KEYS */;
INSERT INTO `utilisateur_seance` VALUES (4,1),(14,12),(14,21),(14,48),(14,57),(15,11),(15,20),(15,38),(15,47),(15,56),(16,10),(16,37),(16,46),(17,9),(17,36),(17,45),(18,8),(18,26),(18,35),(18,44),(18,62);
/*!40000 ALTER TABLE `utilisateur_seance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-03 13:50:46
