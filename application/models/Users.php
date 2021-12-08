<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Users extends CI_Model
{

	public $logged_in = false;
	public $erroring = false;
	public $error_message = '';
	private $user_name = null;

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

	private function on_login_page()
	{
		return !!strpos($_SERVER['REQUEST_URI'], 'login');
	}

	private function in_api()
	{
		return !!strpos($_SERVER['REQUEST_URI'], 'post-batch');
	}

	private function pak_user_uit_post()
	{
		if ($_POST) {
			if (array_key_exists('user', $_POST)) {
				return $_POST['user'];
			} else if (array_key_exists('meta', $_POST)) {
				return $_POST['meta']['user'];
			}
		}
		if ($_GET) {
			if (array_key_exists('user', $_GET)) {
				return $_GET['user'];
			}
		}
		return false;
	}

	public function init()
	{
		if ($user_from_post = $this->pak_user_uit_post()) {
			$this->check_user_name_in_db($user_from_post);
		}
		if (!$this->logged_in && !$this->on_login_page() && !$this->in_api()) {

			if ($_SERVER['HTTP_HOST'] === 'localhost') {
				redirect(base_url('index.php/login'));
			} else {
				redirect(base_url('login'));
			}
		}
	}


	public function get_user()
	{
		if (!$this->logged_in) {
			$this->erroring = true;
			$this->error_message = 'Eerst inloggen';
		}
		if ($this->erroring) {
			return $this->error_message;
		}
		return $this->user_name;
	}

	public function check_user_name_in_db($username)
	{

		$q = $this->db->query("SELECT * FROM users WHERE name = '$username'")->result_array();
		$user_found = count($q) > 0;
		if (!$user_found) {
			$this->logged_in = false;
			$this->erroring = true;
			$this->error_message = "User $username niet gevonden.";
		} else {
			$this->logged_in = true;
			$this->erroring = false;
			$this->user_name = $q[0]['name'];
		}
	}
}
