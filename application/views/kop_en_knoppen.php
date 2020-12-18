<div class='kop-en-knoppen'>
	<article>
		<h1>Sjerp's CRM - v3.0 - tabel: <?=$tabel_naam?> </h1>
		<p>Gebruik mij niet in een openbaar wifi netwerk.<br>
		Als je het wachtwoord niet zeker weet blijf hier dan vanaf.<br>
		<strong>Sla nooit deze wachtwoorden op je computer of browser op.</strong><br>

		</p>
	</article>

	<nav id='crm'>
		<a class='<?php echo ($tabel_naam==="leden"?"actief":""); ?>' href="<?=base_url()?>?tabel=leden">leden</a>
        <a class='<?php echo ($tabel_naam==="nijmegen"?"actief":""); ?>' href="<?=base_url()?>?tabel=nijmegen">nijmegen</a>
		<a class='<?php echo ($tabel_naam==="contacten"?"actief":""); ?>' href="<?=base_url()?>?tabel=contacten">contacten</a>
		<a class='<?php echo ($tabel_naam==="juridisch"?"actief":""); ?>' href="<?=base_url()?>?tabel=juridisch">juridisch</a>
		<a class='<?php echo ($tabel_naam==="inlog"?"actief":""); ?>' href="<?=base_url()?>?tabel=inlog">inloggegevens</a>
		<a href='mailto:info@sjerpbouwtsites.nl?subject=[CRM] - HELP!'>bij paniek</a>
		<a target='_blank' href='<?=base_url()?>todo.html'>planning</a>
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