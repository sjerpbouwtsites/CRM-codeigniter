<form class='crm-nav__samen-wrapper'>
  <div class='crm-nav__button-groep'>
    <button data-eigen-nav="crm-nav-menu" id="schakel-navigatie-menu" class="crm-nav__angled-knop crm-nav__angled-knop--menu">
      <span class="crm-nav__button-turned-letters"><span class="crm-nav__button-letter crm-nav__button-letter--m">m</span><span class="crm-nav__button-letter crm-nav__button-letter--e">e</span><span class="crm-nav__button-letter crm-nav__button-letter--n">n</span><span class="crm-nav__button-letter crm-nav__button-letter--u">u</span></span> <span class="
            crm-nav__knop-icon 
            crm-nav__knop-icon--gesloten 
            crm-nav__knop-icon--menu crm-nav__knop-icon--gesloten--menu            ">
        🖱
      </span>
      <span class="crm-nav__knop-icon crm-nav__knop-icon--open crm-nav__knop-icon--menu crm-nav__knop-icon--open--menu">
        👆
      </span>
    </button>
    <button data-eigen-nav="crm-nav-filters" id="schakel-navigatie-filters" class="crm-nav__angled-knop crm-nav__angled-knop--filters">
      <span class="crm-nav__button-turned-letters"><span class="crm-nav__button-letter crm-nav__button-letter--f">f</span><span class="crm-nav__button-letter crm-nav__button-letter--i">i</span><span class="crm-nav__button-letter crm-nav__button-letter--l">l</span><span class="crm-nav__button-letter crm-nav__button-letter--t">t</span><span class="crm-nav__button-letter crm-nav__button-letter--e">e</span><span class="crm-nav__button-letter crm-nav__button-letter--r">r</span><span class="crm-nav__button-letter crm-nav__button-letter--s">s</span></span> <span class="
            crm-nav__knop-icon 
            crm-nav__knop-icon--gesloten 
            crm-nav__knop-icon--filters crm-nav__knop-icon--gesloten--filters            ">
        🖱
      </span>
      <span class="crm-nav__knop-icon crm-nav__knop-icon--open crm-nav__knop-icon--filters crm-nav__knop-icon--open--filters">
        👆
      </span>
    </button>
    <button data-eigen-nav="crm-nav-acties" id="schakel-navigatie-acties" class="crm-nav__angled-knop crm-nav__angled-knop--acties">
      <span class="crm-nav__button-turned-letters"><span class="crm-nav__button-letter crm-nav__button-letter--a">a</span><span class="crm-nav__button-letter crm-nav__button-letter--c">c</span><span class="crm-nav__button-letter crm-nav__button-letter--t">t</span><span class="crm-nav__button-letter crm-nav__button-letter--i">i</span><span class="crm-nav__button-letter crm-nav__button-letter--e">e</span><span class="crm-nav__button-letter crm-nav__button-letter--s">s</span></span> <span class="
            crm-nav__knop-icon 
            crm-nav__knop-icon--gesloten 
            crm-nav__knop-icon--acties crm-nav__knop-icon--gesloten--acties            ">
        🖱
      </span>
      <span class="crm-nav__knop-icon crm-nav__knop-icon--open crm-nav__knop-icon--acties crm-nav__knop-icon--open--acties">
        👆
      </span>
    </button>
  </div>
  <?php
  echo $navigatie;
  echo $filters;
  echo $acties;
  ?>

</form>