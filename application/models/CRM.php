<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CRM extends CI_Model {

   function __construct() {
		$this->form_data = array();
		$this->een_naam_klein = '';
		$this->load->database();
		$this->post_data = NULL;
   }

	public function zet_post ($post = array()){
		$this->post_data = $post;
	}

	public function pak_tabel_naam(){
		if (!empty($this->post_data) and array_key_exists('form_meta', $this->post_data)) {
			return $this->post_data['form_meta']['tabel_naam'];
		} else {
			return array_key_exists("tabel", $_GET) ? $_GET['tabel'] : "leden";
		}
	}

	public function naam_van_mail($mail = ''){
		$e = explode("@", $mail);
		return ucfirst($e[0]);
	}

	public function form_data_helper ($p = array()) {

		$niet_leeg = count($p) > 0;

		return array(

			"id"			=> $niet_leeg ? $p['id'] : "NULL",

			"naam" 			=> array($niet_leeg ? $p['naam'] 		: "", "text"),
            "groep"			=> array($niet_leeg ? $p['groep'] 		: "", "text"),
			"email" 		=> array($niet_leeg ? $p['email'] 		: "", "email", "required"),
            "telefoon" 		=> array($niet_leeg ? $p['telefoon'] 	: "", "tel"),
            "laatst_gezien" 		=> array($niet_leeg ? $p['laatst_gezien'] 	: "", "tel"),
			"wijk" 			=> array($niet_leeg ? $p['wijk'] 		: "", "text"),
			"sector" 		=> array($niet_leeg ? $p['sector'] 		: "", "text"),
			"ik_wil" 		=> array($niet_leeg ? $p['ik_wil'] 		: "", "textarea"),
			"aantekening" 	=> array($niet_leeg ? $p['aantekening'] : "", "textarea"),

		);
	}

	public function maak_form_data (){

		$tabel = $this->pak_tabel_naam();

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

	public function willekeurige_rij () {

		if (count($this->form_data) > 0 and $this->een_naam_klein !== '') {
			$this->willekeurige_rij = $this->form_data[$this->een_naam_klein];
		} else {
			$this->willekeurige_rij = array();
		}
	}

	public function toon_stijl () {

		$toon_stijl = '';
		$label_en_checkboxes = '';

		if (!$this->willekeurige_rij) {
			$this->willekeurige_rij();
		}

		foreach ($this->willekeurige_rij as $k=>$v) {

			if ($k === 'id') continue;

			if (!$this->post_data or !array_key_exists('check', $this->post_data) ) {
				$val =  "checked='checked'";
			} else if (array_key_exists($k, $this->post_data['check']) and $this->post_data['check'][$k] === "on") {
				$val =  "checked='checked'";
			} else {
				$val =  "";
				$toon_stijl .= ".cel-$k{display:none}";
			}

			$label_en_checkboxes .= "<label for='check-$k'>".str_replace("_", " ", $k)."
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
			'label_en_checkboxes'=> $label_en_checkboxes
		);
	}

	//update
	public function maak_zetlijst ($p){

		$r = '';

		foreach($p as $veld=>$waarde) {
			if ($veld === "id") continue;
			$r .= "$veld = '$waarde',";
		}

		return rtrim($r, ",");
	}

	//insert
	public function maak_veldenlijst($p){

		$r = '';
		foreach($p as $veld=>$waarde) {
			if ($veld === "id") continue;
			$r .= $veld . ",";
		}

		$r = rtrim($r, ",");
		return "(" . $r . ")";
	}

	//insert
	public function maak_waardenlijst ($p){
		$r = '';
		foreach($p as $veld=>$waarde) {
			if ($veld === "id") continue;
			$r .= "'$waarde',";
		}
		$r = rtrim($r, ",");
		return "(" . $r . ")";
	}

	public function maak_db_id_lijst () {

		$tabel = $this->pak_tabel_naam();

		$id_objs = $this->db->query("SELECT id FROM $tabel")->result();
		$ids = [];
		foreach ($id_objs as $io) {
			$ids[] = $io->id;
		}
		return $ids;

	}

	public function opslaan(){

		$form = $this->post_data['form'];
		$tabel = $this->pak_tabel_naam();

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

		foreach($db_id_lijst as $aanwezig) {
			if (!in_array($aanwezig, $form_id_lijst)) {
				$queries['delete'][] = "DELETE FROM $tabel WHERE id = '$aanwezig';";
			}
		}

		foreach($queries as $querielijst) {
			if (count($querielijst) > 0) {
				foreach ($querielijst as $sql) {
					$this->db->query($sql);
				}
			}
		}

		$ret[] = $queries;

		return $ret;
	}

	public function pak_iv () {

		$tabel = $this->pak_tabel_naam();

		$q = $this->db->query("SELECT waarde FROM meta WHERE sleutel='$tabel-iv'")->result();
		return $q[0]->waarde;
	}

	public function zet_iv ($iv = '') {

		$tabel = $this->pak_tabel_naam();

		if ($iv === '') return false;

		$q = $this->db->query("UPDATE meta SET waarde = '$iv' WHERE sleutel='$tabel-iv'");
		return true;
	}

}
