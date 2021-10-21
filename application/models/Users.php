<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Users extends CI_Model
{

	function __construct()
	{
    $this->init();
	}

  public function init(){
		if (!isset($_SESSION)) {
			session_set_cookie_params(0);
			session_start();
		}    
  }

	public function user(){
		if (!array_key_exists('user', $_SESSION)) return null;
		return $_SESSION['user'];
	}

	public function check_user_name_in_db($username){
		$q = $this->db->query("SELECT * FROM users WHERE name = '$username'")->result_array();
		$user_found = count($q) > 0;
		if (!$user_found) {
			echo "<p>User $username niet gevonden.</p>";
		} else {
			$_SESSION["user"] = $q[0]['name'];
		}
	}

	public function handle_user(){

		if(array_key_exists('user', $_POST)) {
			$this->check_user_name_in_db($_POST['user']);
		}

		if (!$this->user()) {
			$this->load->view('set-user.php', [
			]);
			return;
		}		
	}  
}