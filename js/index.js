import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit, {formulierOntsleutelingsAnimatie} from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import DB from "./modules/database.js";
import {zetEscapeKlikVoorAlles, afsluitingsAnimatieHandler} from "./modules/ui-diversen.js";
import nieuweCategorieInit from "./modules/nieuwe-categorie.js";

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
		encryptie.alsWachtwoordGewijzigd();
	})
	
	// sync
	encryptie.decryptieInit();
	formulierOntsleutelingsAnimatie();
	afsluitingsAnimatieHandler();
	nieuweCategorieInit();

	devExInit();
	
}
indexInit();
