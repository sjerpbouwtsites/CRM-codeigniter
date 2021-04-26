import PersoonRij from "./persoon-rij.js";
import { vindInOuders, formInvoerRijenArray } from "./gereedschap.js";
import DB from "./database.js";

import * as gr from "./gereedschap.js";

export default function formulierInit() {
	zetBewerkModusClick();
	willekeurigeGradientHoekrijen();
	zetClicksKeysSluitBewerkModus();
	zetUpdateLaatsGezienClick()
	zetVerwijderRijClick()
	zetAlsVeranderRijInBewerking()
}

/**
 * Zet CSS klas op formulier en versleutelvelden afhankelijk van stand in DB van 'ontsleuteld'
 *
 * @export
 */
export function formulierOntsleutelingsAnimatie(){
	DB().alsVeranderdDoe('ontsleuteld', (ontsleutelWaarde)=> {

		const groteFormulier = gr.el('grote-tabel-formulier');
		if (ontsleutelWaarde === true && !groteFormulier.classList.contains('versleuteld')) {
			groteFormulier.classList.add('versleuteld');
		} else if (ontsleutelWaarde === false && groteFormulier.classList.contains('versleuteld')){
			groteFormulier.classList.remove('versleuteld');
		} else {
			groteFormulier.classList.add(ontsleutelWaarde ? '' : 'versleuteld');
		}

		if (ontsleutelWaarde) {
			gr.el("sleutelaars").classList.add("ontsleuteld");
		}

	})	
}


function zetUpdateLaatsGezienClick() {
	gr.el("form-rijen-lijst")
		.addEventListener("click", function (e) {
			if (e.target.classList.contains("update-laatst-gezien")) {
				e.preventDefault();
				e.target.parentNode.querySelector("input").value = new Date().toLocaleDateString('nl-NL', {day: '2-digit', 'month': '2-digit', 'year': 'numeric'})
			}
		});
	}
	


function zetVerwijderRijClick() {
	// //verwijder functionaliteit
	gr.el('grote-tabel-formulier').addEventListener('click', (e)=>{
		if (!e.target.classList.contains('rij-verwijderen')) {
			return 	
		}
		e.preventDefault();

		const gebruikerId = gr.el('.pers-id', e.target).value;
		const gebruikerNaam = gr.el(`lees-${gebruikerId}-naam`).textContent;

		if (confirm(`${gebruikerNaam} verwijderen?` )){
			const gebruikerRij = gr.el(`form-rij-${gebruikerId}`);
			gebruikerRij.parentNode.removeChild(gebruikerRij)
		}
					
	})

}

//#region bewerkModus
/**
 * toggled de bewerk modus op de form-rij elememen
 */
function zetBewerkModusClick() {
	// zoek voor clicks op of in form-rij
	gr.el("form-rijen-lijst").addEventListener("click", (e) => {
		const rijGeklikt = vindInOuders(e.target, (element) => {
			return element.classList.contains("form-rij");
		});

		const db = DB();

		// als niet op rij geklikt en niet in bewerkmodus, klaar.
		if (!rijGeklikt && !db.bewerkModus) {
			return;
		}
		// als in bewerkmodus en niet op rij geklikt, einde bewerkmodus.
		if (!rijGeklikt && db.bewerkModus) {
			db.bewerkModus = false;
			db.rijInBewerking = null;
			return;
		}

		if (db.bewerkModus && db.rijInBewerking.id === rijGeklikt.id) {
			return;
		}
		
		if (!db.bewerkModus) {
			db.bewerkModus = true;
		}

		db.rijInBewerking = new PersoonRij(rijGeklikt);

		return;

	});
}

function zetAlsVeranderRijInBewerking(){
	DB().alsVeranderdDoe('rijInBewerking', (nieuweRij, oudeRij)=>{
		if (oudeRij) {
			verwijderTabsVanInputs(oudeRij.element);
			oudeRij.schrijfDataNaarLeesVeldenEnZetGeenDataClass();
			oudeRij.element.removeEventListener('change', zetOnChangeRijWasBewerkt)
			oudeRij.element.classList.remove("bewerk-modus");
		}
		if (nieuweRij){
			maakInputsTabBaarEnFocus(nieuweRij.element);
			nieuweRij.element.classList.add("bewerk-modus")
			nieuweRij.element.addEventListener('change', zetOnChangeRijWasBewerkt)
		}
	})
}

function zetOnChangeRijWasBewerkt(){
	const db = DB();
	if (!db.bewerkModus) {
		return;
	}
	db.rijInBewerking.element.classList.add('was-in-bewerk-modus');
	db.rijInBewerking.element.removeEventListener('change', zetOnChangeRijWasBewerkt)
	
}

function zetClicksKeysSluitBewerkModus(){
	document.addEventListener('click', clickEvent =>{
		if (clickEvent.target.classList.contains('beeindig-bewerken-cel')){
			clickEvent.preventDefault();
			DB().bewerkModus = false;
			DB().rijInBewerking = null;
		}
	});
	document.addEventListener('keyup', keyEvent =>{
		if (keyEvent.key ==='Escape'){
			if (DB().bewerkModus) {
				DB().bewerkModus = false;
				DB().rijInBewerking = null;
			} 
		}
	});	
}

/**
 * helper van zetBewerkModusClick
 * focus na 150 ms
 *
 * @param {HTMLElement} formRij
 */
function maakInputsTabBaarEnFocus(formRij) {
	formRij.querySelectorAll(".pers-input").forEach((persInput, index) => {
		persInput.setAttribute("tabindex", index + 1);
	});
	setTimeout(() => {
		formRij.querySelector(".pers-input").focus();
	}, 150);
}

/**
 * helper van zetbewerkModusClick
 *
 * @param {HTMLElement} formRij
 */
function verwijderTabsVanInputs(formRij) {
	formRij.querySelectorAll(".pers-input").forEach((persInput) => {
		persInput.removeAttribute("tabindex");
	});
}
//#endregion bewerkModus



function willekeurigeGradientHoekrijen() {
	formInvoerRijenArray().forEach((rij) => {
		const hoek = Math.floor(Math.random() * 360);
		rij.style.background = `linear-gradient(${hoek}deg, rgba(213, 189, 180, 0.44), rgba(180, 147, 147, 0.47))`;
	});
}

