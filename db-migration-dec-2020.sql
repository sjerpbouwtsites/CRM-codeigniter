/* Eerst met 'lege lij' beginnen */
/* Ongebruikte tabellen weg, gebruik leden als uitgangspunt*/
DROP TABLE contacten;
DROP TABLE nijmegen;
DROP TABLE inlog;
DROP TABLE juridisch;
ALTER TABLE leden DROP COLUMN tabel;
ALTER TABLE leden DROP COLUMN wijk;
ALTER TABLE leden DROP COLUMN groep;
ALTER TABLE leden DROP COLUMN sector;