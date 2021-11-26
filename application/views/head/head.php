	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title><?= $title_el ?></title>
		<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

		<link rel='stylesheet' href="<?= base_url('css/normaliseer.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/sleutelaars.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/controls.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/printer.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/form.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/style.css') ?>">
		<link rel='stylesheet' href="<?= base_url('css/nav.css') ?>">
		<meta http-equiv="Cache-control" content="no-cache">
		<meta name="viewport" content="width=device-width">
		<script src="https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"></script>
		<link rel="shortcut icon" href="<?= base_url('afb/app-icons/favicon.ico') ?>" />
		<link rel="apple-touch-icon" sizes="57x57" href="<?= base_url('afb/app-icons/little-penguin-57-27563.png') ?>">
		<link rel="apple-touch-icon" sizes="72x72" href="<?= base_url('afb/app-icons/little-penguin-72-27563.png') ?>">
		<link rel="apple-touch-icon" sizes="114x114" href="<?= base_url('afb/app-icons/little-penguin-114-27563.png') ?>">
		<link rel="apple-touch-icon" sizes="120x120" href="<?= base_url('afb/app-icons/little-penguin-120-27563.png') ?>">
		<link rel="apple-touch-icon" sizes="144x144" href="<?= base_url('afb/app-icons/little-penguin-144-27563.png') ?>">
		<link rel="apple-touch-icon" sizes="152x152" href="<?= base_url('afb/app-icons/little-penguin-152-27563.png') ?>">
		<link rel="icon" type="image/png" sizes="32x32" href="<?= base_url('afb/app-icons/little-penguin-32-27563.png') ?>">
		<link rel="icon" type="image/png" sizes="16x16" href="<?= base_url('afb/app-icons/little-penguin-16-27563.png') ?>">
		<!--		<link rel="manifest" href="/manifest.json">-->
		<meta name="msapplication-TileColor" content="#d73f3f">
		<meta name="msapplication-TileImage" content="<?= base_url('afb/app-icons/little-penguin-144-27563.png') ?>">
		<meta name="theme-color" content="#d73f3f">
		<base href='<?= base_url() ?>'>
		<script>
		</script>
		<style>
			body.lenin-poster {
				background-image: url("<?= base_url('volg-het-ware-pad.jpg') ?>");
			}

			.formulier-en-controls.categorie-leden {
				background-image: url('<?= base_url("afb/leden-categorie-achtergrond.png") ?>');
			}

			.formulier-en-controls.categorie-contacten {
				background-image: url('<?= base_url("afb/contacten-categorie-achtergrond.png") ?>');
			}

			.formulier-en-controls.categorie-bondgenoten {
				background-image: url('<?= base_url("afb/bondgenoten-categorie-achtergrond.png") ?>');
			}

			.start-bewerken-cel {

				background-image: url("<?= base_url('img/account-edit.png') ?>");

			}

			.rij-in-handmatige-selectie {
				background-image: url("<?= base_url('img/select-group.png') ?>");
			}
		</style>
	</head>