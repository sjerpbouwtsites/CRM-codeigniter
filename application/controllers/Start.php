<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Start extends CI_Controller
{

	function __construct()
	{
		parent::__construct();
		$this->load->model('CRM');
	}

	// dus vloerwerk.org/CRM
	public function index()
	{
		$this->leden();
	}

	/**
	 * Aangeroepen vanuit de routes om andere tabellen dan leden te zien.
	 */
	public function tabel($tabel_naam)
	{
		if ($tabel_naam === '') {
			throw new Error("BOE! een sys error HAHAHA 😱 Je url klopt niet of een tabel die zocht is niet geinstalleerd. Later!");
		}
		$this->CRM->zet_tabel_naam($tabel_naam);
		$this->leden();
	}

	/**
	 * en dat is hoe _wij_ beveiliging doen.
	 */
	public function make_csrf()
	{
		$a = explode(':', uniqid('ACAB_THXBAI', true))[0];
		$b = explode(':', uniqid('AJAX_ADAM', true))[0];
		return "$a-$b";
	}


	/**
	 * DIRTY
	 */
	public function get_controls()
	{
		ob_start();
		$this->load->view('controls');
		return ob_get_clean();
	}

	public function leden()
	{

		$csrf = $this->make_csrf();

		// and send it too the cookie.

		$cookie_dev = [
			'samesite' =>  'Strict',
			'expires' => time() + 60 * 60 * 24 * 2,
			'secure'  => true,
			'path' 		=> "/"
		];

		$cookie_prod = [
			'samesite' =>  'Strict',
			'expires' => time() + 60 * 60 * 24 * 2,
			'domain'  => base_url(),
			'path'		=> "/",
			'secure'  => true,
		];

		$is_local = !!strpos(base_url(), 'localhost');
		setcookie('XSRF-TOKEN', $csrf, $is_local ? $cookie_dev : $cookie_prod);

		$this->CRM->registreer_csrf_token($csrf);

		$data = array();

		$data['tabel_naam'] = $this->CRM->tabel;
		$data = array_merge($data, $this->CRM->maak_form_data());
		$this->CRM->willekeurige_rij(); //@TODO zie ook todo.html
		$data = array_merge($data, $this->CRM->toon_stijl());
		$data['head_el'] = $this->load->view('head/head', $data, TRUE);
		$data['kop_en_knoppen'] = $this->load->view('kop_en_knoppen', $data, TRUE);
		$data['oude_iv'] = $this->CRM->pak_iv();
		$data['csrf_form'] = $csrf;
		$data['controls'] = $this->get_controls();


		$this->load->view('start.php', $data);
	}
}
