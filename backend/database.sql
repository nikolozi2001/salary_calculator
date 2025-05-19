-- Create database if not exists
CREATE DATABASE IF NOT EXISTS salary_calculator;

-- Use the database
USE salary_calculator;


CREATE TABLE IF NOT EXISTS `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) DEFAULT NULL,
  `region` int(11) DEFAULT NULL,
  `business` varchar(256) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `female` int(11) DEFAULT NULL,
  `male` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3393 DEFAULT CHARSET=utf8


CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ge` varchar(250) NOT NULL,
  `name_en` varchar(250) NOT NULL,
  `icon` varchar(250) NOT NULL,
  `orderby` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8