<div class='form-knoppen'>

  <span class='crm-nav__tekst'>Filter op:<br></span>
  <div class='actieform-rij'>
    <select id='contact-selectie-filter' class='crm-nav__tabbaar filter-nav-input groep-select selectie-filter' data-filter='contact'></select>
    <select id='groep-selectie-filter' class='crm-nav__tabbaar filter-nav-input groep-select selectie-filter' data-filter='groep'></select>
    <select id='sector-selectie-filter' class='crm-nav__tabbaar filter-nav-input sector-select selectie-filter' data-filter='sector'></select>
  </div>

  <div class='actieform-rij'>
    <select id='woonplaats-selectie-filter' class='crm-nav__tabbaar filter-nav-input woonplaats-select selectie-filter' data-filter='woonplaats'></select>
    <select id='ik-wil-selectie-filter' data-filter='ik_wil' class='crm-nav__tabbaar filter-nav-input selectie-filter ik_wil-select' data-split='true'></select>
  </div>

  <span class='crm-nav__tekst'>Handmatige selectie: <br></span>
  <div class='actieform-rij'>
    <button id='handmatige-selectie' class='crm-nav__tabbaar sorteer-knoppen filter-nav-input handmatige-selectie'>staat uit</button>
  </div>

  <span class='crm-nav__tekst'>Sorteer op: <br></span>
  <div class='actieform-rij'>
    <button data-sorteert='naam' data-startBij='hoog' data-postfix='A-Z' id='sorteer-op-naam' class='crm-nav__tabbaar sorteer-knoppen filter-nav-input sorteer-op-naam'>Naam</button>
    <button data-sorteert='laatst_gezien' data-startBij='hoog' data-postfix='nieuw -> oud' id='sorteer-op-laatst-gezien' class='crm-nav__tabbaar sorteer-knoppen filter-nav-input sorteer-op-laatst-gezien'>Laatst gezien</button>
  </div>

  <span class='crm-nav__tekst'>Toon weer alles.<br></span>
  <div class='actieform-rij'>
    <button id='reset-navs-en-toon-alles' type='reset' class='crm-nav__tabbaar filter-nav-input selectie-ongedaan'>Terug naar begin</button>
  </div>
</div>