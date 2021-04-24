
/**
 * Kan simpele data bevatten zonder setters en getters;
 * kan via setters op verandering 'on change' callbacks aanroepen
 * opVerandering callbacks krijgen nieuwe waarde mee en DB ref.
 * 
 * @method registreerOpVerandering {string, function} recordNaam, callback - voer functie uit als record wijzigd.
 * @class Database
 */
class Database {
  constructor(){
    this.ontsleuteld = false;
    this.wachtwoord = null;
  }
  
  set ontsleuteld(waarde) {
    if (typeof waarde !== 'boolean'){
      throw new Error('ontsleuteling niet bool')
    }
    this.ontsleuteld = waarde;
    this._draaiOpVerandering(waarde);
  }

  set wachtwoord(waarde) {
    if (typeof waarde !== 'string'){
      throw new Error('wachtwoord niet string')
    }
    this.wachtwoord = waarde;
    this._draaiOpVerandering(waarde);
  }

  /**
   * Wordt aangeroepen door setters. Haalt uit opVerandering object
   * mogelijke callbacks en loopt daardoorheen
   * Voorziet callbacks van nieuwe waarde record en DB ref.
   * @private 
   * @memberof Database
   */
  _draaiOpVerandering = (waarde) => {
    const opVeranderingCallbacks = this._opVerandering[waarde];
    opVeranderingCallbacks.forEach(func =>{
      func(waarde, this)
    })
  }

  /**
   * Registreer callbacks die draaien indien record wijzigt. 
   * Callbacks krijgen nieuwe recordWaarde mee en DB ref.
   *
   * @memberof Database
   */
  registreerOpVerandering = (recordNaam, callback) =>{
    if (!this.hasOwnProperty(recordNaam)) {
      throw new Error(`op verandering func geregistreerd voor niet bestaande prop ${recordNaam}`)
    }
    if (!this._opVerandering.hasOwnProperty(recordNaam)) {
      throw new Error(`opVerandering object kent geen array ${recordNaam}`)
    }
    this._opVerandering[recordNaam] = callback
  }

  /**
   * opslag van callbacks bij veranderen waarden records.
   * @private
   * @memberof Database
   */
  _opVerandering = {
    ontsleuteld: [],
    wachtwoord: []
  }

}

export const DatabaseInstantie = new Database();