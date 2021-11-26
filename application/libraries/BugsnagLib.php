<?php
defined('BASEPATH') or exit('No direct script access allowed');

require_once 'vendor/autoload.php';

class BugsnagLib
{

  public $inst;

  public function __construct($data = null, $from_type = null)
  {
    $bugsnag = Bugsnag\Client::make('0f6d1b127fe9756b8a93ef47b3b20963');
    $registered = Bugsnag\Handler::register($bugsnag);
    $this->inst = $bugsnag;
  }
}
