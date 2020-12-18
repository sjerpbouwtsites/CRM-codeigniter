<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Start extends CI_Controller {

	public function index() {
		$this->leden();
	}

	public function leden(){

		$this->load->model('CRM');

		$data = array();

		if (!empty($_POST)) {
			$this->CRM->zet_post($_POST);
			$opslaan_ant = $this->CRM->opslaan();
		}


		$data['tabel_naam'] = $this->CRM->pak_tabel_naam();

		$data = array_merge($data, $this->CRM->maak_form_data());

		$this->CRM->willekeurige_rij();

		$data = array_merge($data, $this->CRM->toon_stijl());

		$data['head_el'] = $this->load->view('head/head', $data, TRUE);

		$data['kop_en_knoppen'] = $this->load->view('kop_en_knoppen', $data, TRUE);

		$data['oude_iv'] = $this->CRM->pak_iv();

		if (isset($opslaan_ant)) echo "<script>console.dir(".json_encode($opslaan_ant).")</script>";

		$this->load->view('start.php', $data);

	}

}
