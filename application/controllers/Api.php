<?php
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

    $r = $this->CRM->opslaan_via_api($this->post('meta'), $this->post('batch'));
    $this->response($r, 200);
  }
}
