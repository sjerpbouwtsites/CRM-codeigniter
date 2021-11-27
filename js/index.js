import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit, { formulierOntsleutelingsAnimatie } from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import DB from "./modules/database.js";
import { zetEscapeKlikVoorAlles, afsluitingsAnimatieHandler, naOpslaanHerlaadfunctionaliteit } from "./modules/ui-diversen.js";
import nieuweCategorieInit from "./modules/nieuwe-categorie.js";
import bugsnagInit from "./modules/bugsnag.js";

function indexInit() {

	try {
		bugsnagInit();
	} catch (error) {
		console.error(error);
		return;
	}

	// dingen die gaan draaien na decryptie. async.
	DB()
		.alsVeranderdDoe('ontsleuteld', () => {
			if (!DB().ontsleuteld) {
				return;
			}
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
	naOpslaanHerlaadfunctionaliteit();

	devExInit();

}
indexInit();
