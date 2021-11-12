INSERT INTO mensen_meta (
    user,
    categorie,
    velden,
    aanleg_opties,
    vrije_tekst_opties
  )
VALUES (
    'riders',
    'bondgenoten',
    '[{"naam":"organisatie","type":"text"},{"naam":"groep","type":"text"},{"naam":"contact","type":"text","opties":"naam"},{"naam":"woonplaats","type":"text"},{"naam":"email","type":"email","required":true},{"naam":"telefoon","type":"tel"}]',
    '[]',
    '[{"naam":"aantekening","type":"textarea"}]'
  );