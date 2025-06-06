CREATE DATABASE  IF NOT EXISTS `truthleague` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `truthleague`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: truthleague
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `examresults`
--

DROP TABLE IF EXISTS `examresults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examresults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `results` double NOT NULL,
  `rank` int NOT NULL,
  `rreults` double NOT NULL,
  `lresults` double NOT NULL,
  `exams_id` int NOT NULL,
  `users_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_examresults_exams1_idx` (`exams_id`),
  KEY `fk_examresults_users1_idx` (`users_id`),
  CONSTRAINT `fk_examresults_exams1` FOREIGN KEY (`exams_id`) REFERENCES `exams` (`id`),
  CONSTRAINT `fk_examresults_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examresults`
--

LOCK TABLES `examresults` WRITE;
/*!40000 ALTER TABLE `examresults` DISABLE KEYS */;
/*!40000 ALTER TABLE `examresults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exId` varchar(20) NOT NULL,
  `dat` datetime NOT NULL,
  `papers_id` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exams_papers1_idx` (`papers_id`),
  KEY `fk_exams_status1_idx` (`status_id`),
  CONSTRAINT `fk_exams_papers1` FOREIGN KEY (`papers_id`) REFERENCES `papers` (`id`),
  CONSTRAINT `fk_exams_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mcqans`
--

DROP TABLE IF EXISTS `mcqans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mcqans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ans` varchar(100) NOT NULL,
  `questions_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mcqAns_questions1_idx` (`questions_id`),
  CONSTRAINT `fk_mcqAns_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mcqans`
--

LOCK TABLES `mcqans` WRITE;
/*!40000 ALTER TABLE `mcqans` DISABLE KEYS */;
INSERT INTO `mcqans` VALUES (1,' cfsd fdsdsd ',1),(2,'dsf sdS SDfsd fF',1),(3,'ds sd SDF ff',1),(4,'S DS fsdfFf  FdvD  f',1),(5,'dsfsdf ',2),(6,'sdfsd f ',2),(7,'fsdf',2),(8,'dfsdfds',2),(9,'gfddffd',3),(10,'fdgfdfgfd',3),(11,'fgfdgfd',3),(12,'fdgfdgfd',3),(13,'fsdfsd',4),(14,'gfgfgfd',4),(15,'gfdgffgg',4),(16,'fdgfgfdg',4),(25,' gd fgfd fd',7),(26,' gdf dgfdg ',7),(27,'g fdg gfd ',7),(28,'g fdg gfd ',7),(29,'f dfds d',8),(30,'sfdsdsfs',8),(31,'sdfFD',8),(32,'dsfsdf',8),(33,'f dfds d',9),(34,'sfdsdsfs',9),(35,'sdfFD',9),(36,'dsfsdf',9),(37,'f dfds d',10),(38,'sfdsdsfs',10),(39,'sdfFD',10),(40,'dsfsdf',10),(41,'fdgdgdgfd',11),(42,'Kanivud',11),(43,'Hansara',11),(44,'Deawsv',11),(45,'fdsdsfdsf',12),(46,'ghhhjhgj',12),(47,'hhgf',12),(48,'hfghfghfgh',12);
/*!40000 ALTER TABLE `mcqans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papers`
--

DROP TABLE IF EXISTS `papers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `cDAT` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papers`
--

LOCK TABLES `papers` WRITE;
/*!40000 ALTER TABLE `papers` DISABLE KEYS */;
INSERT INTO `papers` VALUES (1,'Galle Class Paper','2025-02-28 13:34:36'),(9,'Galle Class Paper ret','2025-02-28 14:40:46'),(10,'Galle Class Paper ret','2025-02-28 14:55:49'),(11,'Galle Class Paper ret','2025-02-28 14:56:04'),(16,'Galle Class Paper ret','2025-02-28 15:21:58'),(17,'Galle Class Paper ret','2025-02-28 15:23:45');
/*!40000 ALTER TABLE `papers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papers_has_questions`
--

DROP TABLE IF EXISTS `papers_has_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papers_has_questions` (
  `papers_id` int NOT NULL,
  `questions_id` int NOT NULL,
  `Qdifficulty_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `fk_papers_has_questions_questions1_idx` (`questions_id`),
  KEY `fk_papers_has_questions_papers1_idx` (`papers_id`),
  KEY `fk_papers_has_questions_Qdifficulty1_idx` (`Qdifficulty_id`),
  CONSTRAINT `fk_papers_has_questions_papers1` FOREIGN KEY (`papers_id`) REFERENCES `papers` (`id`),
  CONSTRAINT `fk_papers_has_questions_Qdifficulty1` FOREIGN KEY (`Qdifficulty_id`) REFERENCES `qdifficulty` (`id`),
  CONSTRAINT `fk_papers_has_questions_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `FKla2bi92qde1ccm8ml5ykbnrsh` FOREIGN KEY (`Qdifficulty_id`) REFERENCES `q_difficulty` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papers_has_questions`
--

LOCK TABLES `papers_has_questions` WRITE;
/*!40000 ALTER TABLE `papers_has_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `papers_has_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qdifficulty`
--

DROP TABLE IF EXISTS `qdifficulty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qdifficulty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qdifficulty`
--

LOCK TABLES `qdifficulty` WRITE;
/*!40000 ALTER TABLE `qdifficulty` DISABLE KEYS */;
INSERT INTO `qdifficulty` VALUES (1,'Normal'),(2,'Hard');
/*!40000 ALTER TABLE `qdifficulty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quesimages`
--

DROP TABLE IF EXISTS `quesimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quesimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(120) NOT NULL,
  `questions_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quesImages_questions1_idx` (`questions_id`),
  CONSTRAINT `fk_quesImages_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quesimages`
--

LOCK TABLES `quesimages` WRITE;
/*!40000 ALTER TABLE `quesimages` DISABLE KEYS */;
INSERT INTO `quesimages` VALUES (1,'/uploads/images/c88f8544-813d-47b1-a0aa-238208c1c793-11-Screenshot 2024-12-30 084444.png',1),(2,'/uploads/images/c88f8544-813d-47b1-a0aa-238208c1c793-11-Screenshot 2024-12-30 084444.png',1),(3,'/uploads/images/c88f8544-813d-47b1-a0aa-238208c1c793-11-Screenshot 2024-12-30 084444.png',1),(4,'/uploads/images/c88f8544-813d-47b1-a0aa-238208c1c793-11-Screenshot 2024-12-30 084444.png',2),(5,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',3),(6,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',3),(7,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',4),(10,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',7),(11,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',8),(12,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',9),(13,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',10),(14,'/uploads/images/1cfe9cb7-2246-48db-b270-3912f240cbb2-11-Screenshot 2024-12-19 203802.png',11),(15,'/uploads/images/c88f8544-813d-47b1-a0aa-238208c1c793-11-Screenshot 2024-12-30 084444.png',11),(16,'/uploads/images/392b735f-fa3d-4ceb-8abf-8f830b6a2aa2-11-Screenshot 2025-01-05 211129.png',11),(17,'/uploads/images/81e2b5cb-f486-44e8-8e0c-77a4781f8da1-12-Screenshot 2025-01-05 212048.png',12),(18,'/uploads/images/3b8f3324-eb3d-460b-8c14-fa1674f65e98-12-Screenshot 2025-01-07 093709.png',12),(19,'/uploads/images/44cbde47-2a04-43eb-840a-b197eec8e831-12-Screenshot 2025-01-08 080231.png',12),(20,'/uploads/images/71a3e57a-4cda-46f5-9535-0886f45a293f-12-Screenshot 2025-01-08 191717.png',12);
/*!40000 ALTER TABLE `quesimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quesrecodings`
--

DROP TABLE IF EXISTS `quesrecodings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quesrecodings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(120) NOT NULL,
  `questions_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_quesRecodings_questions1_idx` (`questions_id`),
  CONSTRAINT `fk_quesRecodings_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quesrecodings`
--

LOCK TABLES `quesrecodings` WRITE;
/*!40000 ALTER TABLE `quesrecodings` DISABLE KEYS */;
INSERT INTO `quesrecodings` VALUES (1,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',1),(2,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',2),(3,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',3),(4,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',4),(5,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',7),(6,'/uploads/audio/6e9d2d2f-f929-4b4a-8113-c0535d07b3c9-11-audio.mp3',11),(7,'/uploads/audio/9067c89b-04de-4aaf-afd6-24a5625b3380-12-audio.mp3',12);
/*!40000 ALTER TABLE `quesrecodings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ques` varchar(150) NOT NULL,
  `ans` varchar(45) NOT NULL,
  `questype_id` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_questions_questype1_idx` (`questype_id`),
  KEY `fk_questions_status1_idx` (`status_id`),
  CONSTRAINT `fk_questions_questype1` FOREIGN KEY (`questype_id`) REFERENCES `questype` (`id`),
  CONSTRAINT `fk_questions_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'sdadsagfdgf gf fas d sd fsdds fg  bfd fd esd ewfsd WSDdsdfsd fdfdrsfdzfsd fd',' cfsd fdsdsd ',2,1),(2,'dsfsddsfsdf ds dsf ds','dsfsdf ',2,1),(3,'ㅇㄹㅇㄴㄹㄴㅇㄹ ㅇㄴㄹㄴㅇ ㄹㅇㄴ','gfddffd',2,1),(4,'fgfdgfdghg  s f','fsdfsd',2,1),(7,'sadaf  fg fdg ',' gd fgfd fd',2,1),(8,'Image Question','f dfds d',1,1),(9,'Image Question','f dfds d',1,1),(10,'Image Question','f dfds d',1,1),(11,'What is your name','Hansara',2,1),(12,'ㅇㄹㅇㄴㄹㄴㅇㄹ ㅇㄴㄹㄴㅇ ㄹㅇㄴdsad','fdsdsfdsf',2,1);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questype`
--

DROP TABLE IF EXISTS `questype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questype`
--

LOCK TABLES `questype` WRITE;
/*!40000 ALTER TABLE `questype` DISABLE KEYS */;
INSERT INTO `questype` VALUES (1,'Reading'),(2,'Listening');
/*!40000 ALTER TABLE `questype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'Active'),(2,'Deactive');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentansrecodes`
--

DROP TABLE IF EXISTS `studentansrecodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentansrecodes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `exams_id` int NOT NULL,
  `questions_id` int NOT NULL,
  `sAns` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_studentAnsRecodes_users1_idx` (`users_id`),
  KEY `fk_studentAnsRecodes_exams1_idx` (`exams_id`),
  KEY `fk_studentAnsRecodes_questions1_idx` (`questions_id`),
  CONSTRAINT `fk_studentAnsRecodes_exams1` FOREIGN KEY (`exams_id`) REFERENCES `exams` (`id`),
  CONSTRAINT `fk_studentAnsRecodes_questions1` FOREIGN KEY (`questions_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `fk_studentAnsRecodes_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentansrecodes`
--

LOCK TABLES `studentansrecodes` WRITE;
/*!40000 ALTER TABLE `studentansrecodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentansrecodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `index` int NOT NULL,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) NOT NULL,
  `dob` date NOT NULL,
  `nic` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `ps` varchar(100) NOT NULL,
  `gender_id` int NOT NULL,
  `usertype_id` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_gender_idx` (`gender_id`),
  KEY `fk_users_usertype1_idx` (`usertype_id`),
  KEY `fk_users_status1_idx` (`status_id`),
  CONSTRAINT `fk_users_gender` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`),
  CONSTRAINT `fk_users_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_users_usertype1` FOREIGN KEY (`usertype_id`) REFERENCES `usertype` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertype`
--

DROP TABLE IF EXISTS `usertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertype`
--

LOCK TABLES `usertype` WRITE;
/*!40000 ALTER TABLE `usertype` DISABLE KEYS */;
/*!40000 ALTER TABLE `usertype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-28 15:26:54
