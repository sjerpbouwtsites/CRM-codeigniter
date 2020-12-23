/* bondgenoten
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
  contact VARCHAR(255)
);