import acties from "./modules/acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit from "./modules/formulier.js";
import configPaneelInit from "./modules/config-paneel.js";

import {maakSleutelEnVersleutel, maakSleutelEnOntsleutel} from "./modules/encryptie.js";

function DITMOETEENECHTELINKMETENCRYPTIEWORDEN() {
	return new Promise((resolve, reject) => {
		const checkSleutelTeZienInterval = setInterval(() => {
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

function zetEscapeKlikVoorAlles() {
	document.addEventListener("keydown", (event) => {
		// verstopt navs
		if (event.key !== "Escape") return;
		Array.from(document.querySelectorAll(".crm-nav"))
			.map((nav) => new NavElement(nav))
			.forEach((navElement) => {
				navElement.sluit();
			});
		// printer / communiceer
		document.getElementById("printer").style.display = "none";
	});
}

function sleutelaarIsTeZien() {
	return document
		.getElementById("sleutelaars")
		.classList.contains("ontsleuteld");
}

function naEncryptie() {
	navigatieAnimatie();
	formulierInit();
	configPaneelInit();
	// vastleggen bezoek
	localStorage.setItem("vw-crm-eerder-bezocht", "ja");
}

function indexInit() {
	enscyptieModulesFuncsNaarGlobal();
	zetEscapeKlikVoorAlles();
	acties();
	DITMOETEENECHTELINKMETENCRYPTIEWORDEN()
		.then(naEncryptie)
		.catch((nee) => {
			console.error(nee);
		});
}
indexInit();
