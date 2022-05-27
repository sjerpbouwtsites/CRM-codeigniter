<!DOCTYPE html>
<html>
<?= $head_el ?>

<body id='app-body' data-base-url='<?= base_url() ?>'>
  <div class='sleutelaars sleutelaars--user'>
    <form class='sleutelaars-inner sleutelaars-inner--user' method='POST' action='<?= base_url() ?>'>
      <h2 class='versleutelde-titel versleutelde-titel--user versleutelde-titel--kleiner'>Sjerps end-to-end encrypted crm <small>v4.6</small></h2>
      <h2 class='versleutelde-titel versleutelde-titel--user'>
        <?php
        if (!empty($error_message)) {
          echo $error_message;
        } else {
          echo "Wie zijn jullie?";
        }
        ?>
      </h2>
      <label for="ontsleutel">
        <input name='user' id="ontsleutel" placeholder="naam groep" autocapitalize="off">
      </label>
      <button type='submit' id="ontsleutel-knop" class="ontsleutel ontsleutel--user">Verstuur</button>
    </form>
  </div>
</body>

</html>