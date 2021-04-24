



/**
 * Kan simpele data bevatten zonder setters en getters;
 * kan via setters op verandering 'on change' callbacks aanroepen
 * opVerandering callbacks krijgen nieuwe waarde mee en DB ref.
 * 
 * Gebruiken via default export function die singleton blijft geven.
 * import DB from "./modules/database.js";
 * DB().wachtwoord = 'kaasplankjes'; etc
 * 
 * @TODO als groter wordt met proxys werken
 * 
 * @method alsVeranderdDoe {string, function} recordNaam, callback - voer functie uit als record wijzigd.
 * @class Database
 */
export class Database {

  /**
   *singleton storage.
   *
   * @memberof Database
   */
  static _self = null;

  static _data = {
    ontsleuteld: false,
    wachtwoord: null
  }

  constructor(){
    // singleton fix
    if (Database._self && Database._self instanceof Database) {
      return Database._self
    } 
    this._self = this;
    return this;
  }
  
  // SETTERS

  set ontsleuteld(waarde) {
    if (typeof waarde !== 'boolean'){
      throw new Error('ontsleuteling niet bool')
    }
    Database._data.ontsleuteld = waarde;
    this._draaiOpVerandering('ontsleuteld', waarde);
  }

  set wachtwoord(waarde) {
    if (typeof waarde !== 'string'){
      throw new Error('wachtwoord niet string')
    }
    Database._data.wachtwoord = waarde;
    this._draaiOpVerandering('wachtwoord', waarde);
  }

  // GETTERS

  get ontsleuteld(){
    return Database._data.ontsleuteld
  }
  get wachtwoord(){
    return Database._data.wachtwoord
  }

  // METHODES

  /**
   * Wordt aangeroepen door setters. Haalt uit opVerandering object
   * mogelijke callbacks en loopt daardoorheen
   * Voorziet callbacks van nieuwe waarde record en DB ref.
   * @private 
   * @memberof Database
   */
  _draaiOpVerandering = (recordNaam, waarde) => {
    const opVeranderingCallbacks = Database._opVerandering[recordNaam];
    opVeranderingCallbacks.forEach(func =>{
      func(waarde, Database, recordNaam)
    })
  }

  /**
   * Registreer callbacks die draaien indien record wijzigt. 
   * Callbacks krijgen nieuwe recordWaarde mee, DB ref en naam gewijzigde record
   *
   * @memberof Database
   */
   alsVeranderdDoe = (recordNaam, callback) =>{
    if (!Database._data.hasOwnProperty(recordNaam)) {
      throw new Error(`op verandering func geregistreerd voor niet bestaande prop ${recordNaam}`)
    }
    if (!Database._opVerandering.hasOwnProperty(recordNaam)) {
      throw new Error(`opVerandering object kent geen array ${recordNaam}`)
    }
    Database._opVerandering[recordNaam].push(callback);
  }

  /**
   * opslag van callbacks bij veranderen waarden records.
   * @static
   * @private
   * @memberof Database
   */
  static _opVerandering = {
    ontsleuteld: [],
    wachtwoord: []
  }

}

export default function maakDBInstantie() {
  return new Database();
}