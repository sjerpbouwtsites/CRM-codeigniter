<?php


//ales documenteren

//wat te tonen ook in db opslaan
//input sanitize

function cel($html = "", $class = '')
{
	echo "<div class='$class form-cel' >$html</div>";
}



?>
<!DOCTYPE html>
<html>
<?= $head_el ?>

<body data-base-url='<?= base_url() ?>'>

	<?php if ($_SERVER['REMOTE_ADDR'] === '127.0.0.1') {
		echo "<div class='dev-toast'><span>DIT IS DEV<br>GEEN PANIEK</span></div>";
	} else {
		echo "<div class='dev-toast dev-toast--live'><span>⚔ LIVE 🏴‍☠️<br>Verbonden met <br>werk-database.</span></div>";
	} ?>
	<?= $kop_en_knoppen ?>



	<form id='grote-tabel-formulier' class='crm-formulier' action='<?= base_url() ?>sla-tabel-op'>

		<input type='hidden' name='form_meta[csrf-token]' value='<?= $csrf_form ?>'>
		<input type='hidden' id='printIV' name='form_meta[iv]' value='<?= $oude_iv ?>'>
		<input type='hidden' name='form_meta[tabel_naam]' value='<?= $tabel_naam ?>'>

		<?php


		echo "<div class='form-tabel'>";

		echo "<div class='kop form-rij'>";

		cel();

		if ($een_naam_klein !== '') {
			foreach ($form_data[$een_naam_klein] as $k => $v) {

				if ($k === 'id') continue;
				cel(str_replace("_", " ", $k), "cel-$k");
			}
		}

		echo "</div>";

		foreach ($form_data as $pers) :

			echo "<div class='form-rij'>";

			cel("<input
							class='pers-id'
							type='hidden'
							name='form[{$pers['id']}][id]'
							data-naam='id'
							value='{$pers['id']}'
							>", "rij-verwijderen");


			foreach ($pers as $k => $v) :

				if ($k === 'id') continue;

				if ($v[1] === "textarea") {

					$cel_html = "<textarea
									class='pers-input'
									name='form[{$pers['id']}][$k]'
									placeholder='" . str_replace("_", " ", $k) . "'
									data-naam='$k'
								>{$v[0]}</textarea>";
				} else {

					$cel_html = "<input
									class='pers-input'
									name='form[{$pers['id']}][$k]'
									value='${v[0]}'
									type='{$v[1]}'
									" . (array_key_exists(2, $v) ? ($v[2] !== "" ? $v[2] : "") : "") . "
									placeholder='$k'
									data-naam='$k'
                                >";

					if ($k === 'laatst_gezien') {
						$cel_html = "<span class='cel-vervanger'>
                                        $cel_html
                                        <button class='update-laatst-gezien'>NU</button>
                                    </span>
                                    ";
					}
				}


				cel($cel_html, "cel-$k");

			endforeach;

			echo "</div>";

		endforeach;

		echo "</div>";

		?>

	</form>

	<form class='actievelden'>
		<div class='actieveld labels-checkboxes'>
			<h2>Toon kolommen</h2>
			<div class='label-en-checkboxes'>
				<?= $label_en_checkboxes ?>
			</div>
		</div>
		<div class='actieveld form-acties'>
			<h2>Acties<a id='sluit-form-acties' href='#'><img src='<?= base_url() ?>afb/close.png' alt='sluit' title='sluit de notificatie' height='40' width='40' /></a></h2>

			<div class='form-knoppen'>
				<button class='toevoegen'>toevoegen</button>
				<select class='sector-select'></select>
				<select class='ik_wil-select' data-split='true'></select><br>
				<button class='selectie-ongedaan'>selectie ongedaan</button>
				<button class='sorteer-op-naam'>sorteer op naam</button>
				<button class='sorteer-op-laatst-gezien'>sorteer op laatst-gezien</button>
				<button class='lijst-email'>lijst emails</button>
				<button class='lijst-telefoon'>lijst tel nrs</button>
				<label for='lijst-ook-naam'>
					lijst ook de namen.
					<input type='checkbox' id='lijst-ook-naam' name='lijst-ook-naam'>
				</label>
				<br>
				<label for='stapel-filters'>
					stapel filters
					<input type='checkbox' id='stapel-filters' name='stapel-filters'>
				</label>
			</div>
			<button id='verzend-grote-formulier-knop' class='opgepast verzenden'>💾 opslaan</button>
			<button class='opgepast ongedaan'>🏳 herstel </button>
		</div>
	</form>

	<div id='printer'>
		<div>
			<p>tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst </p>
			<a id='sluit-printer' href='#'><img src='<?= base_url() ?>afb/close.png' alt='sluit' title='sluit de notificatie' height='40' width='40' /></a>
		</div>
	</div>

</body>

</html>