<div class='form-knoppen'>
  <div class='actieform-rij'>
    <select class='filter-nav-input groep-select selectie-filter' data-filter='groep'></select>
    <select class='filter-nav-input sector-select selectie-filter' data-filter='sector'></select>
  </div>
  <div class='actieform-rij'>
    <select class='filter-nav-input woonplaats-select selectie-filter' data-filter='woonplaats'></select>
    <select id='ik-wil-select' data-filter='ik_wil' class='filter-nav-input selectie-filter ik_wil-select' data-split='true'></select>
  </div>
  <div class='actieform-rij'>
    <button id='sorteer-op-naam' class='sorteer-knoppen filter-nav-input sorteer-op-naam'>sorteer op naam 👩‍🦱</button>
    <button id='sorteer-op-laatst-gezien' class='sorteer-knoppen filter-nav-input sorteer-op-laatst-gezien'>sorteer op laatst-gezien ⏱</button>
  </div>
  <div class='actieform-rij filter-nav-input'>
    <button id='reset-navs-en-toon-alles' type='reset' class='selectie-ongedaan'>deselecteren 💇‍♀️</button>
    <span class='labels-als-button'>
      <input type='checkbox' id='stapel-filters' name='stapel-filters'>
      <label class='filters-samen-label' for='stapel-filters'>
        <!-- html via css -->
      </label>
    </span>
  </div>
</div>