<?php
$ne = str_split($nav_title);
$nm = array_map(function ($letter) {
  return "<span class='crm-nav__button-letter crm-nav__button-letter--$letter'>$letter</span>";
}, $ne);
$nav_title_spanned =
  "<span class='crm-nav__button-turned-letters'>" .
  implode('', $nm) .
  "</span>";

?>
<div class='crm-nav__wrapper crm-nav__wrapper--<?= $nav_title ?>'>
  <nav data-nav-open='true' data-nav-title='<?= $nav_title ?>' id='crm-nav-<?= $nav_title ?>' class='
    crm-nav 
    crm-nav--<?= $nav_title ?>'>
    <div class='crm-nav__inner crm-nav__inner--<?= $nav_title ?>'>
      <button data-eigen-nav='crm-nav-<?= $nav_title ?>' id='schakel-navigatie-<?= $nav_title ?>' class='crm-nav__angled-knop crm-nav__angled-knop--<?= $nav_title ?>'>
        <?= $nav_title_spanned ?>
        <span class='
            crm-nav__knop-icon 
            crm-nav__knop-icon--gesloten 
            crm-nav__knop-icon--<?= $nav_title ?> crm-nav__knop-icon--gesloten--<?= $nav_title ?>
            '>
          🖱
        </span>
        <span class='crm-nav__knop-icon crm-nav__knop-icon--open crm-nav__knop-icon--<?= $nav_title ?> crm-nav__knop-icon--open--<?= $nav_title ?>'>
          👆
        </span>
      </button>
      <div class='crm-nav__inhoud crm-nav__inhoud--<?= $nav_title ?>'>
        <?= $nav_inhoud ?>
      </div>
    </div>
  </nav>
</div>