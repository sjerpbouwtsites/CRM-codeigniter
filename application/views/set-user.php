<!DOCTYPE html>
<html>
<?= $head_el ?>

<body id='app-body'  data-base-url='<?= base_url() ?>'>
<div class='sleutelaars'>
<form class='sleutelaars-inner' method='POST' action='<?=base_url()?>'>
<h2 class='versleutelde-titel'>Wie zijn jullie?</h2>
<label for="ontsleutel">
    <input name='user' id="ontsleutel" type="password" placeholder="wachtwoord" autocapitalize="off">
  </label>
  <button type='submit' id="ontsleutel-knop" class="ontsleutel">Verstuur</button>
</form>
</div>
</body>
</html>