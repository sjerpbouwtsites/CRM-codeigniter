import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit, {formulierOntsleutelingsAnimatie} from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import DB from "./modules/database.js";
import {zetEscapeKlikVoorAlles, afsluitingsAnimatieHandler} from "./modules/ui-diversen.js";

function indexInit() {
	
	// dingen die gaan draaien na decryptie. async.
	DB()
	.alsVeranderdDoe('ontsleuteld', ()=>{
		navigatieAnimatie();
		formulierInit();
		panelenInit();
		encryptie.encryptieInit();
		printerInit();
		zetEscapeKlikVoorAlles()		
	})

	// sync
	encryptie.decryptieInit();
	formulierOntsleutelingsAnimatie();
	afsluitingsAnimatieHandler();

	devExInit();
	
}
indexInit();
