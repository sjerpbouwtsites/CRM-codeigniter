<?php
defined('BASEPATH') or exit('No direct script access allowed');

require(APPPATH . '/libraries/REST_Controller.php');

use chriskacerguis\RestServer\RestController;

class Api extends RestController
{
  function __construct()
  {
    // Construct the parent class
    parent::__construct();
  }

  public function index()
  {
    // noise
  }

  public function batch_post()
  {

    $this->load->model('CRM');

    $r = $this->CRM->opslaan_vanuit_api(
      $this->post('meta'),
      $this->post('ids'),
      $this->post('kolommen'),
      $this->post('waardenPerId')
    );
    $this->response($r['message'], $r['statuscode']);
  }
}
