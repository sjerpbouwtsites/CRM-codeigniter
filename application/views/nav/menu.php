<ul class='crm-nav__lijst crm-nav__lijst--<?= $nav_title ?>'>
  <?php foreach ($paginalinks as $pagina) :
    $actief_CSS = $pagina['actief'] ? "crm-nav__link--actief" : '';
    $actief_titel = $pagina['actief'] ? "title='je bent reeds hier'" : '';
    $url = $pagina['url'];
    $icon = $pagina['icon'];
    $actief_icon = $pagina['actief'] ? '<span class="crm-nav__actief-icon">🚩</span>' : '';
    echo "<li class='crm-nav__stuk' $actief_titel>
              <a target='_blank' class='crm-nav__tabbaar crm-nav__link $actief_CSS' href='$url'>
              " . $actief_icon . ' '  .
      "<span class='crm-nav__link-naam'>" . $pagina['naam'] . "</span>
              </a>
              <span class='crm-nav__icon'>$icon</span>
          </li>";
  endforeach;
  ?>
</ul>