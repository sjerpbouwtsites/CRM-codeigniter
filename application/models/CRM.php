<?php
defined('BASEPATH') or exit('No direct script access allowed');

class CRM extends CI_Model
{

	public $categorie = 'leden';
	// gevuld door toegestane_categorie_namen()
	public $toegestane_categorie_namen = [];

	function __construct()
	{
		$this->lege_categorie = false;
		$this->form_data = array();
		$this->een_naam_klein = '';
		$this->load->database();
		$this->post_data = NULL;
		$this->load->model('users');
		$this->zet_toegestane_categorie_namen();
		$this->csrf_table_cleanup_corvee = random_int(0, 100) > 95;
	}

	private function user(){
		return $this->users->user();
	}

	/**
	 * categorienamen komen van extern, uit de url of request.
	 * Dit bepaalt welke categorienamen gezet mogen worden adhv bestaande categorienamen.
	 */
	public function zet_toegestane_categorie_namen()
	{

		return $this->toegestane_categorie_namen = ['leden', 'bondgenoten', 'contacten'];
	}

	public function zet_categorie_naam($categorienaam)
	{

		if (!in_array($categorienaam, $this->toegestane_categorie_namen)) {
			throw new Error("de categorie $categorienaam bestaat nog niet in de db.");
		}

		$this->categorie = $categorienaam;
	}

	/**
	 * @deprecated
	 */
	public function zet_post($post = array())
	{
		$this->post_data = $post;
	}


	public function naam_van_mail($mail = '')
	{
		$e = explode("@", $mail);
		return ucfirst($e[0]);
	}

	public function form_data_helper($p = array())
	{

		$niet_leeg = count($p) > 0;

		return array(

			"id"			=> $niet_leeg ? $p['id'] : "1",
			"naam" 			=> array($niet_leeg ? $p['naam'] 		: "", "text"),
			"groep" 			=> array($niet_leeg ? $p['groep'] 		: "", "groep"),
			"sector" 			=> array($niet_leeg ? $p['sector'] 		: "", "sector"),
			"contact" 			=> array($niet_leeg ? $p['contact'] 		: "", "contact"),
			"woonplaats" 			=> array($niet_leeg ? $p['woonplaats'] 		: "", "woonplaats"),
			"email" 		=> array($niet_leeg ? $p['email'] 		: "", "email", "required"),
			"telefoon" 		=> array($niet_leeg ? $p['telefoon'] 	: "", "tel"),
			"laatst_gezien" 		=> array($niet_leeg ? $p['laatst_gezien'] 	: "", "tel"),
			"ik_wil" 		=> array($niet_leeg ? $p['ik_wil'] 		: "", "textarea"),
			"aantekening" 	=> array($niet_leeg ? $p['aantekening'] : "", "textarea"),

		);
	}

	public function maak_form_data()
	{

		$categorie = $this->categorie;
		$u = $this->user();
		$q = $this->db->query("SELECT * FROM mensen WHERE categorie = '$categorie' AND user='$u'" )->result_array();

		if (count($q) > 0) {
			foreach ($q as $p) {

				if ($p['naam'] === '' && $p['email'] === '') {
					//alles leeg
					$this->form_data[] = $this->form_data_helper();
					break;
				}

				$p["naam"] = $p["naam"] !== '' ? $p["naam"] : $this->naam_van_mail($p["email"]);

				$this->een_naam_klein = strtolower($p["naam"]);

				$this->form_data[$this->een_naam_klein] = $this->form_data_helper($p);
			}
		} else {

			$this->form_data[] = $this->form_data_helper();
			$this->lege_categorie = true;
			$this->een_naam_klein = '';
		}

		return array(
			'form_data' 		=> $this->form_data,
			'een_naam_klein' 	=> $this->een_naam_klein,
		);
	}

	public function willekeurige_rij()
	{

		if (count($this->form_data) > 0 and $this->een_naam_klein !== '') {
			$this->willekeurige_rij = $this->form_data[$this->een_naam_klein];
		} else {
			$this->willekeurige_rij = array();
		}
	}

	public function toon_stijl()
	{

		$toon_stijl = '';
		$label_en_checkboxes = '';

		if (!$this->willekeurige_rij) {
			$this->willekeurige_rij();
		}

		foreach ($this->willekeurige_rij as $k => $v) {

			if ($k === 'id') continue;

			if (!$this->post_data or !array_key_exists('check', $this->post_data)) {
				$val =  "checked='checked'";
			} else if (array_key_exists($k, $this->post_data['check']) and $this->post_data['check'][$k] === "on") {
				$val =  "checked='checked'";
			} else {
				$val =  "";
				$toon_stijl .= ".cel-$k{display:none}";
			}

			$label_en_checkboxes .= "<label for='check-$k'>" . str_replace("_", " ", $k) . "
				<input
					id='check-$k'
					type='checkbox'
					name='check[$k]'
					class='toon'
					$val
				>
			</label>";
		}

		return array(
			'toon_stijl' => $toon_stijl,
			'label_en_checkboxes' => $label_en_checkboxes
		);
	}

	//update
	public function maak_zetlijst($p)
	{

		$r = '';

		foreach ($p as $veld => $waarde) {
			if ($veld === "id") continue;
			$r .= "$veld = '$waarde',";
		}

		return rtrim($r, ",");
	}

	//insert
	public function maak_veldenlijst($p)
	{

		$r = '';
		foreach ($p as $veld => $waarde) {
			if ($veld === "id") continue;
			$r .= $veld . ",";
		}

		$r = rtrim($r, ",");
		return "(" . $r . ")";
	}

	//insert
	public function maak_waardenlijst($p)
	{
		$r = '';
		foreach ($p as $veld => $waarde) {
			if ($veld === "id") continue;
			$r .= "'$waarde',";
		}
		$r = rtrim($r, ",");
		return "(" . $r . ")";
	}

	public function maak_db_id_lijst()
	{

		$categorie = $this->categorie;
		$u = $this->user();

		$id_objs = $this->db->query("SELECT id FROM mensen WHERE categorie = '$categorie' AND user='$u'")->result();
		$ids = [];
		foreach ($id_objs as $io) {
			$ids[] = $io->id;
		}
		return $ids;
	}

	/**
	 * verwerkt batch reageert met HTTP status en message. 
	 * @return array ['statuscode', 'message']
	 */
	public function opslaan_vanuit_api($meta, $ids, $kolommen, $waarden_per_id)
	{

		$this->zet_categorie_naam($meta['categorie']);

		// controlerenof xsrf goed is.
		$csrf_db_check_res = $this->controleer_csrf_token($meta['xsrf']);
		if ($csrf_db_check_res === 'niet-gevonden') {
			return [
				'statuscode' => 403,
				'message'		 => 'Je netverzoek voldoet niet aan de vereisten. Cookies moeten toegestaan zijn voor dit domein. Cookies wissen betekent verbinding effectief verbreken.'
			];
		}
		if ($csrf_db_check_res === 'verouderd') {
			return [
				'statuscode' => 401,
				'message'		 => 'Je gegsevens zijn verouderd en voldoen niet aan de vereisten. Je mag maximaal 24 uur doen over het invullen en opslaan van het systeem.'
			];
		}
		// daadwerkelijke xsrf check

		/**
		 * WE SKIPPEN DE CSRF CHECK 
		 */
		// $cookie_exists = array_key_exists('XSRF-TOKEN', $_COOKIE);
		// if (!$cookie_exists) {
		// 	return [
		// 		'statuscode' => 401,
		// 		'message'		 => 'Waarom gaf je geen Cookies? Heb je die uit staan?'
		// 	];
		// } else if ($_COOKIE['XSRF-TOKEN'] !== $meta['xsrf']) {
		// 	return [
		// 		'statuscode' => 403,
		// 		'message'		 => 'Je verzoek is contrarevolutionair.'
		// 	];
		// }

		$kolommen[] = 'user';
		$kolommen[] = 'categorie';
		$user = $meta['user'];

		$kolommen_string = "(" . implode(', ', $kolommen) . ")";
		$waarden_string_map = [];
		foreach ($waarden_per_id as $id => $waarden) {
			$waarden_met_apostrophe = array_map(function ($waarde) {
				return "'" . $waarde . "'";
			}, $waarden);
			$waarden_met_apostrophe[] = "'".$user."'";
			$waarden_met_apostrophe[] = "'".$this->categorie."'";
			$waarden_string_map[] .= "(" . implode(",", $waarden_met_apostrophe) . ")";
		}
		$waarden_string = implode(", ", $waarden_string_map);

		$sql_s = "INSERT INTO mensen $kolommen_string VALUES $waarden_string";

		try {
			$this->db->query("DELETE FROM mensen WHERE categorie='$this->categorie' AND user='$user'");
			$this->db->query($sql_s);

			$this->zet_iv($meta['iv']);
		} catch (\Throwable $th) {
			return [
				'statuscode' => 500,
				'message'    => $th,
			];
		}

		$leden_er_in = count($ids);
		$sql_s = "SELECT count(id) as count FROM mensen WHERE categorie = '$this->categorie' AND user='$user'";
		$leden_huidig = $this->db->query($sql_s)->result()[0]->count;

		return [
			'statuscode' => 200,
			'message'    => "Ging goed! $leden_er_in er in; en nu in DB:" . $leden_huidig,
		];
	}

	/**
	 * old form-based function
	 * @deprecated
	 */
	public function opslaan()
	{

		$form = $this->post_data['form'];
		$categorie = $this->categorie;

		$this->zet_iv($this->post_data['form_meta']['iv']);

		$veldenlijst = false;

		$db_id_lijst = $this->maak_db_id_lijst();
		$form_id_lijst = [];

		$queries = array(
			'insert' => [],
			'update' => [],
			'delete' => [],
		);

		$ret = [];
		//$ret[] = $this->post_data;

		foreach ($form as $pers) {

			$form_id_lijst[] = $pers['id'];

			//in id lijst? -> update sql
			if (in_array($pers['id'], $db_id_lijst)) {

				$zetlijst = $this->maak_zetlijst($pers);
				$queries['update'][] = "UPDATE mensen SET $zetlijst WHERE id = {$pers['id']}; AND user = '$this->user()'";
			} else { //niet in id lijst? -> insert sql

				//maar één keer maken.
				if (!$veldenlijst) {
					$veldenlijst = $this->maak_veldenlijst($pers);
				}

				$waardenlijst = $this->maak_waardenlijst($pers);
				$queries['insert'][] = "INSERT INTO mensen $veldenlijst VALUES $waardenlijst;";
			}
		}

		$u =$this->user();
		foreach ($db_id_lijst as $aanwezig) {
			if (!in_array($aanwezig, $form_id_lijst)) {
				$queries['delete'][] = "DELETE FROM mensen WHERE id = '$aanwezig' AND user = '$u';";
			}
		}

		foreach ($queries as $querielijst) {
			if (count($querielijst) > 0) {
				foreach ($querielijst as $sql) {
					$this->db->query($sql);
				}
			}
		}

		$ret[] = $queries;

		return $ret;
	}

	public function pak_iv()
	{

		$categorie = $this->categorie;
		$u = $this->user();
		$sql = "SELECT waarde FROM meta WHERE sleutel='$categorie-iv' AND user='$u'";

		$q = $this->db->query($sql);
		if (count ($q->result()) < 1) {
			echo "<h1>geen iv gevonden</h1>";
			echo "<code>$sql</code>";
			echo "<pre>";
			var_dump($q);
			echo "</pre>";
die();
		}
		return $q->result()[0]->waarde;
	}

	public function zet_iv($iv = '')
	{

		$categorie = $this->categorie;

		if ($iv === '') return false;
$u = $this->user();
		$q = $this->db->query("UPDATE meta SET waarde = '$iv' WHERE sleutel='$categorie-iv' AND user='$u'");
		return true;
	}

	/**
	 * Aangeroepen in controller Personslist bij maken voorkant
	 * csrf dubbel dienst als auth token
	 */
	public function registreer_csrf_token($csrf)
	{
		if (!$csrf) {
			throw new Error('csrf token registreren maar token is leeg');
		}
		$this->db->query("INSERT INTO CSRF (token) VALUES ('$csrf')");

		if ($this->csrf_table_cleanup_corvee) {
			$this->csrf_table_cleanup();
		}

		return true;
	}

	/**
	 * remove tokens older then 2 days.
	 */
	public function csrf_table_cleanup()
	{
		$this->db->query("DELETE FROM CSRF WHERE TIMESTAMPDIFF(DAY, modified_on, NOW()) > 2");
	}

	/**
	 * Controleer of token in db is en of die actueel is.
	 * @returns (string) statuscode niet-gevonden|gevonden|verouderd
	 */
	public function controleer_csrf_token($csrf)
	{
		if (!$csrf) {
			throw new Error('csrf token controleren maar token is leeg');
		}
		$token_in_db_en_actueel_query = $this->db->query("SELECT COUNT(id) as aantal FROM CSRF WHERE token = '$csrf' AND TIMESTAMPDIFF(DAY, modified_on, NOW()) < 1");
		$token_in_db_query = $this->db->query("SELECT COUNT(id) as aantal FROM CSRF WHERE token = '$csrf'");

		$token_in_db = $token_in_db_query->result()[0]->aantal !== '0';
		$token_vers = $token_in_db_en_actueel_query->result()[0]->aantal !== '0';

		if (!$token_in_db) {
			return 'niet-gevonden';
		}
		if ($token_in_db && !$token_vers) {
			return 'verouderd';
		}
		if ($token_in_db && $token_vers) {
			return 'gevonden';
		}
		// opgefokt?
		return new Error('shitlogic @controleer_csrf_token');
	}
}
