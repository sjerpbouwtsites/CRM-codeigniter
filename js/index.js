import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import * as gr from "./modules/gereedschap.js";


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

function sleutelaarIsTeZien() {
	return gr.el("sleutelaars")
		.classList.contains("ontsleuteld");
}



function naDecryptie() {
	navigatieAnimatie();
	formulierInit();
	panelenInit();
	encryptie.encryptieInit();
	printerInit();
	// vastleggen bezoek
	localStorage.setItem("vw-crm-eerder-bezocht", "ja");
	zetEscapeKlikVoorAlles()

}

function indexInit() {
	encryptie.decryptieInit();
	devExInit();
	DITMOETEENECHTELINKMETENCRYPTIEWORDEN()
		.then(naDecryptie)
		.catch((nee) => {
			console.error(nee);
		});
}
indexInit();
