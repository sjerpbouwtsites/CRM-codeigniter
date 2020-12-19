<div class='kop-en-knoppen'>
	<article>
		<h1>Sjerp's CRM - v3.1 - tabel: <?= $tabel_naam ?> </h1>

		<p>Uitleg? <br>Bel sjerp: 0616541143 of<br>Mail dev@sjerpbouwtsites.nl<br>Vind je iets kut of een fout? Hier is me <a target='_blank' href='<?= base_url() ?>todo.html'>planning</a></p>

	</article>

	<nav id='crm'>
		<a class='<?php echo ($tabel_naam === "leden" ? "actief" : ""); ?>' href="<?= base_url() ?>?tabel=leden">leden</a>
		<a class='<?php echo ($tabel_naam === "nijmegen" ? "actief" : ""); ?>' href="<?= base_url() ?>?tabel=nijmegen">nijmegen</a>
		<a class='<?php echo ($tabel_naam === "contacten" ? "actief" : ""); ?>' href="<?= base_url() ?>?tabel=contacten">contacten</a>
		<a class='<?php echo ($tabel_naam === "juridisch" ? "actief" : ""); ?>' href="<?= base_url() ?>?tabel=juridisch">juridisch</a>
		<a class='<?php echo ($tabel_naam === "inlog" ? "actief" : ""); ?>' href="<?= base_url() ?>?tabel=inlog">inloggegevens</a>


	</nav>

	<nav id='mobiel'>
		<button class='mob-toon' data-toon='form-acties'>toon admin veld</button>
	</nav>

	<div class='sleutelaars'>
		<div>
			<label for='ontsleutel'>
				<input id='ontsleutel' type='text' placeholder='wachtwoord' autocapitalize="off">
			</label>
			</label>
			<button class='ontsleutel'>ontsleutel</button>
		</div>
		<div>
			<label for='versleutel'>
				<input id='versleutel' type='text' placeholder='wachtwoord' autocapitalize="off">
			</label>
			<button class='versleutel'>versleutel</button>
		</div>
	</div>
</div>