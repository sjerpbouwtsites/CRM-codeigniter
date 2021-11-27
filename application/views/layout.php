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

<body id='app-body' data-base-url='<?= base_url() ?>'>

	<?= $kop_en_knoppen ?>

	<button id='herlaad-pagina-knop' class='herladen verborgen'>Herladen</button>

	<div class='formulier-en-controls categorie-<?= $categorie_naam ?>'>

		<form id='grote-categorie-formulier' <?= $lege_categorie ? 'data-lege-categorie="true"' : "" ?> data-form-stijl='blokken' class='crm-formulier' action='smtp://nonsense' data-action='<?= base_url() ?>post-batch'>

			<input type='hidden' name='form_meta[user]' value='<?= $_SESSION['user'] ?>'>
			<input type='hidden' name='form_meta[csrf-token]' value='<?= $csrf_form ?>'>
			<input type='hidden' id='printIV' name='form_meta[iv]' value='<?= $oude_iv ?>'>
			<input type='hidden' name='form_meta[categorie_naam]' value='<?= $categorie_naam ?>'>

			<?php


			echo "<div id='form-rijen-lijst' class='form-tabel'>";

			foreach ($form_data as $pers) :

				echo "<div id='form-rij-{$pers['id']}' class='form-rij'>";

				echo "<button class='start-bewerken-cel'></button>";
				echo "<button class='beeindig-bewerken-cel'></button>";
				echo "<button class='rij-in-handmatige-selectie'></button>";

				cel("<input
							class='pers-id'
							id='pers-{$pers['id']}-id'
							type='hidden'
							name='form[{$pers['id']}][id]'
							data-naam='id'
							value='{$pers['id']}'
							>", "rij-verwijderen");


				foreach ($pers as $k => $v) :

					if ($k === 'id') continue;

					if ($v[1] === "textarea") {

						$cel_html = "

								<textarea
									class='pers-input verborgen'

									id='pers-{$pers['id']}-{$k}'
									name='form[{$pers['id']}][$k]'
									placeholder='" . str_replace("_", " ", $k) . "'
									data-naam='$k'
								>{$v[0]}</textarea>
								<span data-naam='$k' id='lees-{$pers['id']}-{$k}' class='pers-lezen verborgen pers-lezen__$k'></span>
								";
					} else {

						$cel_html = "<input
					
									class='pers-input verborgen'
									id='pers-{$pers['id']}-{$k}'
									name='form[{$pers['id']}][$k]'
									value='${v[0]}'
									type='{$v[1]}'
									" . (array_key_exists(2, $v) ? ($v[2] !== "" ? $v[2] : "") : "") . "
									placeholder='$k'
									data-naam='$k'
								>
								<span data-naam='$k' id='lees-{$pers['id']}-{$k}' class='pers-lezen verborgen pers-lezen__$k'></span>
																
																";

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

		<?= $controls ?>
	</div>
	<div id='printer'>
		<div class='printer-inner'>
			<p class='print-p'>tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst </p>
			<a id='sluit-printer' href='#'><img src='<?= base_url() ?>afb/close.png' alt='sluit' title='sluit de notificatie' height='40' width='40' /></a>
		</div>
	</div>
	<script type='module' src="<?= base_url('js/index.js') ?>"></script>
</body>

</html>