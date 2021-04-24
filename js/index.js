import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import * as gr from "./modules/gereedschap.js";
import DB from "./modules/database.js";


function zetEscapeKlikVoorAlles() {
	document.addEventListener("keydown", (event) => {
		// verstopt navs
		if (event.key !== "Escape") return;
		gr.elArray('.crm-nav')
			.map((nav) => new NavElement(nav))
			.forEach((navElement) => {
				navElement.sluit();
			});
		// printer / communiceer
		gr.el("printer").style.display = "none";
	});
}

function naDecryptie() {
	navigatieAnimatie();
	formulierInit();
	panelenInit();
	encryptie.encryptieInit();
	printerInit();
	zetEscapeKlikVoorAlles()
}

function indexInit() {
	
	// dingen die gaan draaien na decryptie. async.
	
	DB()
	.registreerOpVerandering('ontsleuteld', naDecryptie)

	// sync
	encryptie.decryptieInit();
//	devExInit();
	
}
indexInit();
