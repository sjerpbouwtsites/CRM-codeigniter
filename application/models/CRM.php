<?php
defined('BASEPATH') or exit('No direct script access allowed');

class CRM extends CI_Model
{

	public $tabel = 'leden';
	// gevuld door toegestane_tabel_namen()
	public $toegestane_tabel_namen = [];

	function __construct()
	{
		$this->form_data = array();
		$this->een_naam_klein = '';
		$this->load->database();
		$this->post_data = NULL;
		$this->zet_toegestane_tabel_namen();
		$this->csrf_table_cleanup_corvee = random_int(0, 100) > 9;
	}

	/**
	 * tabelnamen komen van extern, uit de url of request.
	 * Dit bepaalt welke tabelnamen gezet mogen worden adhv bestaande tabelnamen.
	 */
	public function zet_toegestane_tabel_namen()
	{
		// maar een keer vullen.
		if (!count($this->toegestane_tabel_namen)) {
			$alle_db_tabellen_query = $this->db->query("SHOW TABLES");
			foreach ($alle_db_tabellen_query->result() as $resultObj) {
				$tabelnaam = $resultObj->Tables_in_CRM_local;
				if ($tabelnaam !== 'CSRF' || $tabelnaam !== 'meta') {
					$this->toegestane_tabel_namen[] = $tabelnaam;
				}
			}
		}
		return $this->toegestane_tabel_namen;
	}

	public function zet_tabel_naam($tabelnaam)
	{
		if (!array_key_exists($tabelnaam, $this->toegestane_tabel_namen)) {
			throw new Error('deze tabel bestaat nog niet in de db.');
		}
		$this->tabel = $tabelnaam;
	}

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

			"id"			=> $niet_leeg ? $p['id'] : "NULL",
			"naam" 			=> array($niet_leeg ? $p['naam'] 		: "", "text"),
			"email" 		=> array($niet_leeg ? $p['email'] 		: "", "email", "required"),
			"telefoon" 		=> array($niet_leeg ? $p['telefoon'] 	: "", "tel"),
			"laatst_gezien" 		=> array($niet_leeg ? $p['laatst_gezien'] 	: "", "tel"),
			"ik_wil" 		=> array($niet_leeg ? $p['ik_wil'] 		: "", "textarea"),
			"aantekening" 	=> array($niet_leeg ? $p['aantekening'] : "", "textarea"),

		);
	}

	public function maak_form_data()
	{

		$tabel = $this->tabel;

		$q = $this->db->query("SELECT * FROM $tabel")->result_array();

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
			$this->een_naam_klein = '';
		}

		ksort($this->form_data);

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

		$tabel = $this->tabel;

		$id_objs = $this->db->query("SELECT id FROM $tabel")->result();
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
	public function opslaan_via_api($batches_meta, $batch_data)
	{
		// controlerenof xsrf goed is.
		$csrf_db_check_res = $this->controleer_csrf_token($batches_meta['xsrf']);
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
		$cookie_exists = array_key_exists('XSRF-TOKEN', $_COOKIE);
		if (!$cookie_exists) {
			return [
				'statuscode' => 401,
				'message'		 => 'Waarom gaf je geen Cookies? Heb je die uit staan?'
			];
		} else if ($_COOKIE['XSRF-TOKEN'] !== $batches_meta['xsrf']) {
			return [
				'statuscode' => 403,
				'message'		 => 'Je verzoek is contrarevolutionair.'
			];
		}

		return [
			'statuscode' => 200,
			'message'    => 'NOG TE BOUWEN',
		];
	}

	/**
	 * old form-based function
	 * @deprecated
	 */
	public function opslaan()
	{

		$form = $this->post_data['form'];
		$tabel = $this->tabel;

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
				$queries['update'][] = "UPDATE $tabel SET $zetlijst WHERE id = {$pers['id']};";
			} else { //niet in id lijst? -> insert sql

				//maar één keer maken.
				if (!$veldenlijst) {
					$veldenlijst = $this->maak_veldenlijst($pers);
				}

				$waardenlijst = $this->maak_waardenlijst($pers);
				$queries['insert'][] = "INSERT INTO $tabel $veldenlijst VALUES $waardenlijst;";
			}
		}

		foreach ($db_id_lijst as $aanwezig) {
			if (!in_array($aanwezig, $form_id_lijst)) {
				$queries['delete'][] = "DELETE FROM $tabel WHERE id = '$aanwezig';";
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

		$tabel = $this->tabel;

		$q = $this->db->query("SELECT waarde FROM meta WHERE sleutel='$tabel-iv'")->result();
		return $q[0]->waarde;
	}

	public function zet_iv($iv = '')
	{

		$tabel = $this->tabel;

		if ($iv === '') return false;

		$q = $this->db->query("UPDATE meta SET waarde = '$iv' WHERE sleutel='$tabel-iv'");
		return true;
	}

	/**
	 * Aangeroepen in controller Start bij maken voorkant
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
