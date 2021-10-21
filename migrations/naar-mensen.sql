CREATE TABLE `mensen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefoon` varchar(255) DEFAULT NULL,
  `laatst_gezien` varchar(255) DEFAULT NULL,
  `ik_wil` text DEFAULT NULL,
  `aantekening` text DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `woonplaats` varchar(255) DEFAULT NULL,
  `groep` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `categorie` varchar(255) NOT NULL DEFAULT 'leden',
  `user` varchar(255) NOT NULL DEFAULT 'vloerwerk',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `mensen` (
  naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, categorie
) SELECT naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, 'leden' FROM leden;

INSERT INTO `mensen` (
  naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, categorie
) SELECT naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, 'bondgenoten' FROM bondgenoten;

INSERT INTO `mensen` (
  naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, categorie
) SELECT naam, email, telefoon, laatst_gezien, ik_wil, aantekening, sector, woonplaats, groep, contact, user, 'contacten' FROM contacten;

DROP TABLE leden;
DROP TABLE bondgenoten;
DROP TABLE contacten;