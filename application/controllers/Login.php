<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Login extends CI_Controller
{
  function __construct()
  {
    parent::__construct();
    $this->load->model('users');
  }

  private function crm_url()
  {

    return base_url('crm');
  }

  public function index()
  {
    if ($this->users->logged_in) {

      redirect($this->crm_url());
    } else {
      $this->log_in();
    }
  }

  public function log_in()
  {

    $data = [];
    $data['title_el'] = 'Sjerps CRM';
    // var_dump($this->users);
    // die();
    $data['error_message'] = $this->users->error_message;
    $data['head_el'] = $this->load->view('head/head', $data, TRUE);
    $this->load->view(
      'set-user.php',
      $data
    );
    return;
  }
}
