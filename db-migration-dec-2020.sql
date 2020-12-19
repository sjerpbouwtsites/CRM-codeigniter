/* Eerst met 'lege lij' beginnen */
/* Ongebruikte tabellen weg, gebruik leden als uitgangspunt*/
DROP TABLE contacten;
DROP TABLE nijmegen;
DROP TABLE inlog;
DROP TABLE juridisch;
ALTER TABLE leden DROP COLUMN tabel;