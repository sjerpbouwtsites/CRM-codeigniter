<nav id='crm-pagina-nav' class='crm-pagina-nav crm-pagina-nav--open'>
  <div class='crm-pagina-nav__inner'>
    <button id='schakel-navigatie' class='crm-pagina-nav__angled-knop'>
      Nav
      <span class='crm-pagina-nav__knop-icon crm-pagina-nav__knop-icon--gesloten'>
        👉
      </span>
      <span class='crm-pagina-nav__knop-icon crm-pagina-nav__knop-icon--open'>
        🤪
      </span>
    </button>
    <ul class='crm-pagina-nav__lijst'>
      <?php foreach ($paginalinks as $pagina) :
        $actief_CSS = $pagina['actief'] ? "crm-pagina-nav__link--actief" : '';
        $actief_titel = $pagina['actief'] ? "title='je bent reeds hier'" : '';
        $url = $pagina['url'];
        $icon = $pagina['icon'];
        $actief_icon = $pagina['actief'] ? '<span class="crm-pagina-nav__actief-icon">🚩</span>' : '';
        echo "<li class='crm-pagina-nav__stuk' $actief_titel>
              <a class='crm-pagina-nav__link $actief_CSS' href='$url'>
              " . $actief_icon . ' '  .
          "<span class='crm-pagina-nav__link-naam'>" . $pagina['naam'] . "</span>
              </a>
              <span class='crm-pagina-nav__icon'>$icon</span>
          </li>";
      endforeach;
      ?>
    </ul>

  </div>
</nav>