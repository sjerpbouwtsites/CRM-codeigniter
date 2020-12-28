<form class='actievelden'>

  <a id='sluit-form-acties' href='#'><img src='<?= base_url() ?>afb/close.png' alt='sluit' title='sluit de notificatie' height='40' width='40' /></a>

  <?= $navigatie ?>
  <div class='form-knoppen'>
    <div class='actieform-rij'>
      <select class='groep-select selectie-filter' data-filter='groep'></select>
      <select class='sector-select selectie-filter' data-filter='sector'></select>
    </div>
    <div class='actieform-rij'>
      <select class='woonplaats-select selectie-filter' data-filter='woonplaats'></select>
      <select id='ik-wil-select' data-filter='ik_wil' class='selectie-filter ik_wil-select' data-split='true'></select>
    </div>
    <div class='actieform-rij'>
      <button class='sorteer-op-naam'>sorteer op naam</button>
      <button class='sorteer-op-laatst-gezien'>sorteer op laatst-gezien</button>
    </div>
    <div class='actieform-rij'>
      <button class='lijst-email'>lijst emails</button>
      <button class='lijst-telefoon'>lijst tel nrs</button>
    </div>
    <div class='actieform-rij'>
      <label for='lijst-ook-naam'>
        lijst ook de namen.
        <input type='checkbox' id='lijst-ook-naam' name='lijst-ook-naam'>
      </label>
      <label for='stapel-filters'>
        stapel filters
        <input type='checkbox' id='stapel-filters' name='stapel-filters'>
      </label>
    </div>

    <div class='actieform-rij'>
      <button class='selectie-ongedaan'>selectie ongedaan</button>
      <button class='opgepast ongedaan'>🏳 herstel </button>
    </div>
    <div class='actieform-rij'>
      <button id='verzend-grote-formulier-knop' class='opgepast verzenden'>💾 opslaan</button>
    </div>
    <div class='actieform-rij'>
      <button id='voeg-rij-toe' class='toevoegen'>toevoegen</button>
    </div>

  </div>
</form>