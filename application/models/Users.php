<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Users extends CI_Model
{

	function __construct()
	{
		$this->init();
	}

	private function meldFout(\Throwable $th, $context = '')
	{
		$this->bugsnaglib->inst->notifyError($context, $th->getMessage());
		throw $th;
		die();
	}

	private function meldUitzondering(\Throwable $th)
	{
		$this->bugsnaglib->inst->notifyException($th->getMessage());
		throw $th;
	}

	private function dataPlat($data)
	{
		ob_start();
		print_r($data);
		return ob_get_clean($data);
	}

	public function init()
	{
		if (!isset($_SESSION)) {
			session_set_cookie_params(0);
			session_start();
			$_SESSION["user_foutmelding"] = null;
		}
	}

	public function user()
	{
		try {
			if (!array_key_exists('user', $_SESSION)) return null;
			return $_SESSION['user'];
		} catch (\Throwable $th) {
			$this->meldFout($th, ' user func user model');
		}
	}

	public function check_user_name_in_db($username)
	{

		$q = $this->db->query("SELECT * FROM users WHERE name = '$username'")->result_array();
		$user_found = count($q) > 0;
		if (!$user_found) {
			$_SESSION["user_foutmelding"] = "User $username niet gevonden.";
		} else {
			$_SESSION["user_foutmelding"] = null;
			$_SESSION["user"] = $q[0]['name'];
		}
	}

	public function handle_user()
	{

		if (array_key_exists('user', $_POST)) {
			$this->check_user_name_in_db($_POST['user']);
		}

		if (!$this->user()) {
			$data = [];
			$data['title_el'] = 'Sjerps CRM';
			$data['head_el'] = $this->load->view('head/head', $data, TRUE);
			$this->load->view(
				'set-user.php',
				$data
			);
			return;
		}
	}
}
