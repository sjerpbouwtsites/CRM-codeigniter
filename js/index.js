import acties from "./modules/acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit from "./modules/formulier.js";
import configPaneelInit from "./modules/config-paneel.js";
import {decryptieInit, encryptieInit} from "./modules/encryptie.js";
import {alsOpLocalHostOnthoudDecrypieEnVoerIn, welkomstWoord} from "./modules/gereedschap.js";

import {maakSleutelEnVersleutel, maakSleutelEnOntsleutel} from "./modules/encryptie.js";

function DITMOETEENECHTELINKMETENCRYPTIEWORDEN() {
	return new Promise((resolve, reject) => {
		const checkSleutelTeZienInterval = setInterval(() => {
			console.log('NET ENCRYPTIE PROMISE OID')
			if (!sleutelaarIsTeZien()) {
				return;
			} else {
				clearInterval(checkSleutelTeZienInterval);
				resolve();
			}
		}, 50);
	});
}

/**
 * Omdat form.js nog een global script is en encryptie reeds een module vereist 
 * form global funcs.
 */
function enscyptieModulesFuncsNaarGlobal(){
	window['maakSleutelEnVersleutel'] = maakSleutelEnVersleutel;
	window['maakSleutelEnOntsleutel']	= maakSleutelEnOntsleutel;
}



function sleutelaarIsTeZien() {
	return document
		.getElementById("sleutelaars")
		.classList.contains("ontsleuteld");
}



function naDecryptie() {
	navigatieAnimatie();
	formulierInit();
	configPaneelInit();
	encryptieInit();
	welkomstWoord();
	// vastleggen bezoek
	localStorage.setItem("vw-crm-eerder-bezocht", "ja");
}

function indexInit() {
	enscyptieModulesFuncsNaarGlobal();
	
	decryptieInit();
	acties();
	alsOpLocalHostOnthoudDecrypieEnVoerIn();
	DITMOETEENECHTELINKMETENCRYPTIEWORDEN()
		.then(naDecryptie)
		.catch((nee) => {
			console.error(nee);
		});
}
indexInit();
