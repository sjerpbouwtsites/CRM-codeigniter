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
    try {
      $this->load->model('CRM');
      $this->load->model('users');
    } catch (\Throwable $th) {
      $this->meldFout($th, 'laden CRM in API fout');
      $this->response(
        $th->getMessage(),
        503
      );
    }

    // $this->load->model('users');
  }
  private function meldFout(\Throwable $th, $context = '')
  {
    $this->bugsnaglib->inst->notifyError($context, $th->getMessage());
    throw $th;
    die();
  }
  public function index()
  {
    // noise
  }



  public function batch_post()
  {
    try {
      $this->users->check_user_name_in_db($this->post('meta')['user']);
      if ($this->users->erroring) {
        $this->response(
          'user ontbreekt of is verkeerd: ' . $this->post('meta')['user'],
          400
        );
      }
      $r = $this->CRM->opslaan_vanuit_api(
        $this->post('meta'),
        $this->post('ids'),
        $this->post('kolommen'),
        $this->post('waardenPerId')
      );
      $this->response($r['message'], $r['statuscode']);
    } catch (\Throwable $th) {
      $this->response($th, 503);
    }
  }
}
