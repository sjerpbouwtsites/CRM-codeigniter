import DB from "./database.js";
import * as gr from "./gereedschap.js";

export default function nieuweCategorieInit(){
  
  if (gr.el('grote-categorie-formulier').hasAttribute('data-lege-categorie')) {

    const ww = prompt('Nieuwe categorie? Waarmee wordt versleuteld?');
    DB().wachtwoord =ww;
    DB().ontsleuteld = true;
    
  }

}

