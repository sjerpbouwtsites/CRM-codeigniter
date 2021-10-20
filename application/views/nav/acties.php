<div class='form-knoppen'>

  <div class='actieform-rij'>
    <button id='lijst-mail-button' class='crm-nav__tabbaar actieknoppen lijst-email'>📃 mail</button>
    <button id='lijst-telefoon-button' class='crm-nav__tabbaar actieknoppen lijst-telefoon'>📃 tel</button>
    <button id='lijst-telefoon-multi' class='crm-nav__tabbaar actieknoppen lijst-multi'>📃 multi</button>    
    <?php if ($is_op_leden) : ?><button id='riseup-check' class='crm-nav__tabbaar actieknoppen riseup-check'>Riseup check</button>    <?php endif; ?>
  </div>
  <div class='actieform-rij'>
    <span class='labels-als-button'>
      <input class='crm-nav__tabbaar' type='checkbox' id='lijst-ook-naam' name='lijst-ook-naam'>
      <label class='lijst-namen-label' for='lijst-ook-naam'>
        <!-- html via css -->
      </label>
    </span>
    <button id='wijzigingen-ongedaan-maken' class='crm-nav__tabbaar actieknoppen opgepast ongedaan'>alles ongedaan</button>
  </div>
  <div class='actieform-rij'>
     <button id='schakel-multi-bewerk' class='crm-nav__tabbaar actieknoppen open-multi-bewerk'>Hele selectie bewerken</button>
  </div>

  <div class='actieform-rij'>
    <button id='wachtwoord-veranderen' class='crm-nav__tabbaar actieknoppen opgepast wachtwoord-veranderen'>🔑⚡☣ - wachtwoord veranderen</button>
  </div>

  <div class='actieform-rij'>
    <button id='verzend-grote-formulier-knop' class='crm-nav__tabbaar actieknoppen opgepast verzenden'>🔐 & 💾 - opslaan</button>
  </div>
  <div class='actieform-rij'>
    <button id='voeg-rij-toe' class='crm-nav__tabbaar actieknoppen toevoegen'>🏭 toevoegen </button>
  </div>

</div>