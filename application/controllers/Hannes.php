<?php

defined('BASEPATH') or exit('No direct script access allowed');

// deze klasse bestaat om te hannessen

class Hannes extends CI_Controller
{
  function __construct(){
    parent::__construct();
    $this->load->model('gehannes');
  }

  function index(){
    $this->gehannes->herschrijf_database();
  }
}