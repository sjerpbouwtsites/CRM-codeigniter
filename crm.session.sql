DROP TABLE mensen_meta;
CREATE TABLE `mensen_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL DEFAULT 'vloerwerk',
  `categorie` varchar(255) NOT NULL DEFAULT 'leden',
  `velden` text DEFAULT NULL,
  `aanleg_opties` text DEFAULT NULL,
  `vrije_tekst_opties` VARCHAR(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

