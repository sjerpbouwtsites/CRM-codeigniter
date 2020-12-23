/* Eerst met 'lege lij' beginnen */
/* Ongebruikte tabellen weg, gebruik leden als uitgangspunt*/
DROP TABLE contacten;
DROP TABLE nijmegen;
DROP TABLE inlog;
DROP TABLE juridisch;
ALTER TABLE leden DROP COLUMN tabel;
/* Hier worden csrf tokens bijgehouden die dubbel dienst doen als ajax-token
 token wordt verstrekt via de HTML die achter de authenticatie zit
 */
CREATE TABLE CSRF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255),
  modified_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)