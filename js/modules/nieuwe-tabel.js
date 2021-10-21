import DB from "./database.js";
import * as gr from "./gereedschap.js";

export default function nieuweTabelInit(){
  
  if (gr.el('grote-tabel-formulier').hasAttribute('data-lege-tabel')) {

    const ww = prompt('Nieuwe tabel? Waarmee wordt versleuteld?');
    DB().wachtwoord =ww;
    DB().ontsleuteld = true;
    
  }

}

