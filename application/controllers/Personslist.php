<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Personslist extends CI_Controller
{

	function __construct()
	{
		parent::__construct();
		$this->load->model('CRM');
		$this->url_delen = explode('/', $_SERVER['REQUEST_URI']);
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

	function nav_icons($icon)
	{
		switch ($icon) {
			case 'leden':
				return '🦹‍♂️';
				break;
			case  'bondgenoten':
				return '👩‍🔧';
				break;
			case 'contacten':
				return '📱';
				break;
			case 'Bel Sjerp':
				return '🙉';
				break;
			case 'Mail Sjerp':
				return '🙈';
				break;
			default:
				return '⚒';
		}
	}

	/**
	 * @returns array met naam, url, actief bool, icon.
	 * haalt adhv toegestane tabellen nav aan.
	 */
	public function make_nav()
	{

		$pages = array_map(function ($tabel) {

			return [
				'naam' 		=> $tabel,
				'url'  		=> base_url() . "tabel/$tabel",
				'actief'	=> in_array($tabel, $this->url_delen),
			];
		}, $this->CRM->toegestane_tabel_namen);

		$pages[] = [
			'naam'	=> 'Bel Sjerp',
			'url'		=> "tel:+31616541143",
			'actief' => false,
		];
		$pages[] = [
			'naam'	=> 'Mail Sjerp',
			'url'		=> "mailto:dev@sjerpbouwtsites.nl",
			'actief' => false,
		];

		$pages_with_icons = array_map(function ($nav_part) {
			$icon_a = [
				'icon'	=> $this->nav_icons($nav_part['naam'])
			];
			return array_merge($icon_a, $nav_part);
		}, $pages);

		return $pages_with_icons;
	}

	public function dirty_get_view($link, $data)
	{
		ob_start();
		$this->load->view($link, $data);
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

		$data['navigatie'] = $this->dirty_get_view('nav/nav.php', [
			'nav_title'		=> 'menu',
			'nav_inhoud'	=> $this->dirty_get_view('nav/menu.php', [
				'nav_title'	=> 'menu',
				'paginalinks' => $this->make_nav(),
			])
		]);
		$data['filters'] = $this->dirty_get_view('nav/nav.php', [
			'nav_title'		=> 'filters',
			'nav_inhoud'  => $this->dirty_get_view('nav/filters.php', [])
		]);
		$data['acties'] = $this->dirty_get_view('nav/nav.php', [
			'nav_title'		=> 'acties',
			'nav_inhoud'  => $this->dirty_get_view('nav/acties.php', [])
		]);
		$data['controls'] = $this->dirty_get_view('controls.php', $data);
		$this->load->view('layout.php', $data);
	}
}
