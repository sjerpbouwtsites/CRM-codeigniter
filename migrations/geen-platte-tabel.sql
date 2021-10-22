CREATE TABLE `mensen_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL DEFAULT 'vloerwerk',
  `categorie` varchar(255) NOT NULL DEFAULT 'leden',
  `velden` text DEFAULT NULL,
  `aanleg_opties` text DEFAULT NULL,
  `vrije_tekst_opties` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('vloerwerk', 
'leden', 
'[{"naam":"groep","type":"text"},{"naam":"sector","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"},{"naam":"laatst_gezien","type":"date"},{"naam":"aanleg","type":"select","multi":true}]',
'["plakken","schrijven","klussen","organisen"]',
'[{"naam":"aantekening","type":"textarea"}]'
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('vloerwerk', 
'contacten', 
'[{"naam":"groep","type":"text"},{"naam":"sector","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"},{"naam":"laatst_gezien","type":"date"}]',
'[]',
'[{"naam":"aantekening","type":"textarea"}, {"naam":"mails","type":"textarea"}]'
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('vloerwerk', 
'bondgenoten', 
'[{"naam":"organisatie","type":"text"},{"naam":"groep","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"}]',
'[]',
'[{"naam":"aantekening","type":"textarea"}]'
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('riders', 
'leden', 
'[{"naam":"groep","type":"text"},{"naam":"sector","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"},{"naam":"laatst_gezien","type":"date"},{"naam":"aanleg","type":"select","multi":true}]',
'["plakken","schrijven","klussen","organisen"]',
'[{"naam":"aantekening","type":"textarea"}]'
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('riders', 
'contacten', 
'[{"naam":"groep","type":"text"},{"naam":"sector","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"},{"naam":"laatst_gezien","type":"date"}]',
'[]',
'[{"naam":"aantekening","type":"textarea"}, {"naam":"mails","type":"textarea"}]'
);

INSERT INTO 
mensen_meta (user, categorie, velden, aanleg_opties, vrije_tekst_opties) 
VALUES 
('riders', 
'bondgenoten', 
'[{"naam":"organisatie","type":"text"},{"naam":"groep","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"}]',
'[]',
'[{"naam":"aantekening","type":"textarea"}]'
);

ALTER TABLE mensen ADD COLUMN `velden` TEXT NOT NULL;
ALTER TABLE mensen ADD COLUMN `aanleg_opties` TEXT NOT NULL;
ALTER TABLE mensen ADD COLUMN `aanleg` TEXT NOT NULL;