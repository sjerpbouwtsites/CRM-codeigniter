<nav class='crm-pagina-nav'>
  <ul class='crm-pagina-nav__lijst'>
    <?php foreach ($paginalinks as $pagina) :
      $actief_CSS = $pagina['actief'] ? "crm-pagina-nav__link--actief" : '';
      $url = $pagina['url'];
      echo "<li class='crm-pagina-nav__stuk'>
          <a class='crm-pagina-nav__link $actief_CSS' href='$url'>" . $pagina['naam'] . "</a>
        </li>";
    endforeach;
    ?>
  </ul>
</nav>