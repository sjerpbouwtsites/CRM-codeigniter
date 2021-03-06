/* Eerst met 'lege lij' beginnen */
/* Ongebruikte tabellen weg, gebruik leden als uitgangspunt*/
DROP TABLE contacten;
DROP TABLE nijmegen;
DROP TABLE inlog;
DROP TABLE juridisch;
ALTER TABLE leden DROP COLUMN tabel;
ALTER TABLE leden DROP COLUMN wijk;
ALTER TABLE leden
ADD COLUMN woonplaats VARCHAR(255);
ALTER TABLE leden
ADD COLUMN contact VARCHAR(255);
/* Hier worden csrf tokens bijgehouden die dubbel dienst doen als ajax-token
 token wordt verstrekt via de HTML die achter de authenticatie zit
 */
CREATE TABLE CSRF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255),
  modified_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
/* contacten, arbeiders
 */
CREATE TABLE contacten (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naam VARCHAR(255),
  email VARCHAR(255),
  telefoon VARCHAR(255),
  laatst_gezien VARCHAR(255),
  ik_wil TEXT,
  aantekening TEXT,
  sector VARCHAR(255),
  woonplaats VARCHAR(255),
  groep VARCHAR(255),
  contact VARCHAR(255);
);
/* bondgenoten
 */
CREATE TABLE bondgenoten (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naam VARCHAR(255),
  email VARCHAR(255),
  telefoon VARCHAR(255),
  laatst_gezien VARCHAR(255),
  ik_wil TEXT,
  aantekening TEXT,
  sector VARCHAR(255),
  woonplaats VARCHAR(255),
  groep VARCHAR(255),
  contact VARCHAR(255)
);
/* iv voor bondgenoten */
INSERT INTO meta (meta_id, sleutel, waarde)
VALUES (6, 'bondgenoten-iv', 'r9cDptXhQy4m3glOuh6wew==');
UPDATE meta
SET waarde = 'r9cDptXhQy4m3glOuh6wew==';