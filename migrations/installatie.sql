/* maak csrf / json token tabel */
CREATE TABLE CSRF (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(255),
  `modified_on` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
/* alle mensen die geen lid zijn maar contact opnamen in weze */
CREATE TABLE contacten (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `naam` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL,
  `telefoon` VARCHAR(255),
  `laatst_gezien` VARCHAR(255),
  `ik_wil` TEXT,
  `aantekening` TEXT,
  `sector` VARCHAR(255),
  `woonplaats` VARCHAR(255),
  `groep` VARCHAR(255),
  `contact` VARCHAR(255)
);
/*onzin contact*/
INSERT INTO `contacten` (
    `id`,
    `naam`,
    `email`,
    `telefoon`,
    `laatst_gezien`,
    `ik_wil`,
    `aantekening`,
    `sector`,
    `woonplaats`,
    `groep`,
    `contact`
  )
VALUES (
    1,
    'cIRPkpbw7MvN6N1VvuZZjw==',
    'SpI3JR7/LEcSou6WWICy1mkdbN60WUasQvIVFWfgmqs=',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA=='
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
/* onzin bondgenoot. */
INSERT INTO `bondgenoten` (
    `id`,
    `naam`,
    `email`,
    `telefoon`,
    `laatst_gezien`,
    `ik_wil`,
    `aantekening`,
    `sector`,
    `woonplaats`,
    `groep`,
    `contact`
  )
VALUES (
    1,
    'cIRPkpbw7MvN6N1VvuZZjw==',
    'SpI3JR7/LEcSou6WWICy1mkdbN60WUasQvIVFWfgmqs=',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA=='
  );
/* leden
 */
CREATE TABLE leden (
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
/* onzin bondgenoot. */
INSERT INTO `leden` (
    `id`,
    `naam`,
    `email`,
    `telefoon`,
    `laatst_gezien`,
    `ik_wil`,
    `aantekening`,
    `sector`,
    `woonplaats`,
    `groep`,
    `contact`
  )
VALUES (
    1,
    'cIRPkpbw7MvN6N1VvuZZjw==',
    'SpI3JR7/LEcSou6WWICy1mkdbN60WUasQvIVFWfgmqs=',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA==',
    'L/+vLIUfeF7O5o9zbqP8VA=='
  );
/* zoutjes, public keys... */
CREATE TABLE `meta` (
  `meta_id` int(11) NOT NULL,
  `sleutel` text NOT NULL,
  `waarde` text NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Gegevens worden geëxporteerd voor tabel `meta`
--
INSERT INTO `meta` (`meta_id`, `sleutel`, `waarde`)
VALUES (1, 'leden-iv', 'AUElUoiQ+gA/65A8hO2p7w=='),
  (2, 'contacten-iv', 'AUElUoiQ+gA/65A8hO2p7w=='),
  (4, 'inlog-iv', 'AUElUoiQ+gA/65A8hO2p7w=='),
  (6, 'bondgenoten-iv', 'AUElUoiQ+gA/65A8hO2p7w==');
--
-- Indexen voor geëxporteerde tabellen
--
--
-- Indexen voor tabel `meta`
--
ALTER TABLE `meta`
ADD PRIMARY KEY (`meta_id`);