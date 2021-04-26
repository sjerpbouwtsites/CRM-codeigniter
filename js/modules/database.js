import PersoonRij from "./persoon-rij.js";



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
    ontsleutelFout: false,
    wachtwoord: null,
    opslagProcedure: null,
    bewerkModus: false,
    rijInBewerking: null,
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
    const oudeWaarde = Database._data.ontsleuteld;
    Database._data.ontsleuteld = waarde;
    this._draaiOpVerandering('ontsleuteld', waarde, oudeWaarde);
  }

  set ontsleutelFout(waarde) {
    if (typeof waarde !== 'boolean'){
      throw new Error('ontsleutelFout niet bool')
    }
    const oudeWaarde = Database._data.ontsleutelFout;
    Database._data.ontsleutelFout = waarde;
    this._draaiOpVerandering('ontsleutelFout', waarde, oudeWaarde);
  }  

  set bewerkModus(waarde) {
    if (typeof waarde !== 'boolean'){
      throw new Error('bewerkModus niet bool')
    }
    const oudeWaarde = Database._data.bewerkModus;
    Database._data.bewerkModus = waarde;
    this._draaiOpVerandering('bewerkModus', waarde, oudeWaarde);
  }

  set rijInBewerking(waarde) {
    if (!waarde instanceof PersoonRij){
      throw new Error('rijInBewerking niet PersoonRij')
    }
    const oudeWaarde = Database._data.rijInBewerking;
    Database._data.rijInBewerking = waarde;
    this._draaiOpVerandering('rijInBewerking', waarde, oudeWaarde);
  }
  

  set wachtwoord(waarde) {
    if (typeof waarde !== 'string'){
      throw new Error('wachtwoord niet string')
    }
    const oudeWaarde = Database._data.wachtwoord;
    Database._data.wachtwoord = waarde;
    this._draaiOpVerandering('wachtwoord', waarde, oudeWaarde);
  }

  set opslagProcedure(waarde) {
    if (typeof waarde !== 'string'){
      throw new Error('opslagProcedure niet string')
    }    
    if (!['voorbereiding', 'succesvol', 'mislukt', 'herstarten'].includes(waarde)) {
      throw new Error('opslagProcedure niet toestane waarde '+waarde)
    }
    const oudeWaarde = Database._data.opslagProcedure;
    Database._data.opslagProcedure = waarde;
    this._draaiOpVerandering('opslagProcedure', waarde, oudeWaarde);
  }

  // GETTERS

  get ontsleuteld(){
    return Database._data.ontsleuteld
  }
  get ontsleutelFout(){
    return Database._data.ontsleutelFout
  }    
  get bewerkModus(){
    return Database._data.bewerkModus
  }  
  get rijInBewerking(){
    return Database._data.rijInBewerking
  }
  get wachtwoord(){
    return Database._data.wachtwoord
  }
  get opslagProcedure(){
    return Database._data.opslagProcedure
  }

  // METHODES

  /**
   * Wordt aangeroepen door setters. Haalt uit opVerandering object
   * mogelijke callbacks en loopt daardoorheen
   * Voorziet callbacks van nieuwe waarde record en DB ref.
   * @private 
   * @memberof Database
   */
  _draaiOpVerandering = (recordNaam, waarde, oudeWaarde) => {
    const opVeranderingCallbacks = Database._opVerandering[recordNaam];
    opVeranderingCallbacks.forEach(func =>{
      func(waarde, oudeWaarde, recordNaam, Database)
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
    ontsleutelFout: [],
    bewerkModus: [],
    rijInBewerking: [],
    wachtwoord: [],
    opslagProcedure: [],
  }

}

export default function maakDBInstantie() {
  return new Database();
}