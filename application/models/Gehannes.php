<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Gehannes extends CI_Model
{

	function __construct()
	{
    $this->load->database();
	}

  /**
   * JE LOOPT ER TEGEN AAN DAT HET GEENCRYPT OP DE DATABASE STAAT EN JE HET DUS NIET UIT ELKAAR KAN TREKKEN
   * WANT STRAKS GAAT DE JSON ENCRYPTED WEER DE DB IN.
   * DUS DE DATA MOET LOKAAL GEPAKT WORDEN, ONENCRYPT DE DB IN, EN DAN WEER WEL ENCRYPTEN
   */

  function herschrijf_database(){

    $mensen_herschrijven = $this->maak_mensen_opslag();

    foreach ($mensen_herschrijven as $mens){
      $velden = $mens['velden'];
      $vrije_tekst = $mens['vrije_tekst'];
      $aanleg = $mens['aanleg'];
      $this->db->query("UPDATE mensen SET (velden, vrije_tekst, aanleg) VALUES (
        $velden,
        $vrije_tekst,
        $aanleg
      )");
    }
  
  } // end func

  function maak_mensen_opslag(){
    $meta_vloerwerk = $this->creeerMeta('vloerwerk');
    $meta_riders  =$this->creeerMeta('riders');
    $meta = [
      'vloerwerk'=> $meta_vloerwerk,
      'riders'=> $meta_riders,
    ];

    $mensen_te_verwerken = $this->db->query("SELECT * FROM mensen WHERE velden = ''")->result_array();

    $mensen_naar_opslag = [];
    foreach($mensen_te_verwerken as $mens) {
      $categorie = $mens['categorie'];
      $user = $mens['user'];
      $mens['velden'] = [];
      foreach ($meta[$user][$categorie]['velden'] as $veld) {

        if ($veld->naam === 'aanleg') continue;

        $waarde = array_key_exists($veld->naam, $mens) 
        ? $mens[$veld->naam]
        : '';
        $mens['velden'][] = [
          'naam' => $veld->naam,
          'waarde'=> $waarde
        ];
      }

      $mens['vrije_tekst'] = [];
      foreach ($meta[$user][$categorie]['vrije_tekst_opties'] as $vrije_tekst) {
        if (array_key_exists($vrije_tekst->naam, $mens)) {
          $mens['vrije_tekst'][$vrije_tekst->naam] = $mens[$vrije_tekst->naam];
        }
      }

      $mens['aanleg'] = $mens['ik_wil'];

      unset($mens['email']);
      unset($mens['telefoon']);
      unset($mens['laatst_gezien']);
      unset($mens['woonplaats']);
      unset($mens['groep']);
      unset($mens['contact']);
      unset($mens['sector']);
      unset($mens['aantekening']);
      unset($mens['ik_wil']);

      $mensen_naar_opslag[] = $mens;
    }    
    return $mensen_naar_opslag;
  }

  function creeerMeta($user){
    $meta_rauw = [
      'leden' => $this->db->query("SELECT * FROM mensen_meta WHERE categorie='leden' AND user='$user'")->result_array()[0],
      'contacten' => $this->db->query("SELECT * FROM mensen_meta WHERE categorie='contacten' AND user='$user'")->result_array()[0],
      'bondgenoten' => $this->db->query("SELECT * FROM mensen_meta WHERE categorie='bondgenoten'AND user='$user'")->result_array()[0]
    ];

    $meta = [];
    foreach ($meta_rauw as $naam=>$mr) {
      $meta[$naam] = [];
      $skip = ['id', 'naam', 'user', 'categorie'];
      $dont_process = ['updated_at'];
      foreach ($mr as $recordnaam=>$recordval) {

        if (in_array($recordnaam, $skip)) continue;

        if (in_array($recordnaam, $dont_process)) {
          $meta[$naam][$recordnaam] = $recordval;
          continue;
        }

        if ($this->isJson($recordval)) {
          $meta[$naam][$recordnaam] = json_decode($recordval);
          continue;
        }

        $meta[$naam][$recordnaam] = $recordval;

      }
    }
    return $meta;    
  }


  function isJson($string) {
    json_decode($string);
    return json_last_error() === JSON_ERROR_NONE;
 }

}