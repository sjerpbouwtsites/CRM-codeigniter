import acties from "./modules/acties.js";
import navigatieAnimatie from "./modules/navigatie-animatie.js";
import formulierInit from "./modules/formulier.js";

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

function sleutelaarIsTeZien() {
	return document
		.getElementById("sleutelaars")
		.classList.contains("ontsleuteld");
}

function naEncryptie() {
	navigatieAnimatie();
	formulierInit();
	// vastleggen bezoek
	localStorage.setItem("vw-crm-eerder-bezocht", "ja");
}

function indexInit() {
	acties();
	DITMOETEENECHTELINKMETENCRYPTIEWORDEN()
		.then(naEncryptie)
		.catch((nee) => {
			console.error(nee);
		});
}
indexInit();
