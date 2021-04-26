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
		const rijIsGeklikt = vindInOuders(e.target, (element) => {
			return element.classList.contains("form-rij");
		});
		const bewerkend = document.querySelector(".bewerk-modus");
		if (bewerkend) {
			// hij was bewerken en rijIsGeklikt is niet de bewerkende rij.
			// of klikte buiten formulier. sluit alles.
			if (!rijIsGeklikt || (rijIsGeklikt && rijIsGeklikt.id !== bewerkend.id)) {
				verwijderBewerkModus()
			}
			return;
		}
		if (!rijIsGeklikt) {
			return;
		}

		// bewerk-modus is staat voor bewerken
		// was in bewerk modus is om na sluiten bewerken te tonen dat dingen zijn bewerkt.
		if (!rijIsGeklikt.classList.contains("bewerk-modus")) {
			rijIsGeklikt.classList.add("bewerk-modus")
			maakInputsTabBaarEnFocus(rijIsGeklikt);
			rijIsGeklikt.addEventListener('change', zetOnChangeRijWasBewerkt)
		} 
			

		//scroll naar element
		window.location.hash = rijIsGeklikt.id;
	});
}

function zetOnChangeRijWasBewerkt(changeEvent){
	const rij = vindInOuders(changeEvent.target, (element) => {return element.classList.contains('form-rij')}, 5)
	if (rij) {

		rij.classList.add('was-in-bewerk-modus');
		rij.removeEventListener('change', zetOnChangeRijWasBewerkt)
	}
}

function verwijderBewerkModus(){
	const bewerkend = gr.el(".bewerk-modus");
	if (!bewerkend) {
		throw new Error('sluit bewerken... maar niets wordt bewerkt')
		return;
	}
	bewerkend.classList.remove("bewerk-modus");
	verwijderTabsVanInputs(bewerkend);
	(() => {
		new PersoonRij(
			bewerkend
		).schrijfDataNaarLeesVeldenEnZetGeenDataClass();
	})();	
}

function zetClicksKeysSluitBewerkModus(){
	document.addEventListener('click', clickEvent =>{
		if (clickEvent.target.classList.contains('beeindig-bewerken-cel')){
			clickEvent.preventDefault();
			verwijderBewerkModus()
		}
	});
	document.addEventListener('keyup', keyEvent =>{
		if (keyEvent.key ==='Escape'){
			verwijderBewerkModus()
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

