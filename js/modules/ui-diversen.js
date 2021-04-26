import DB from "./database.js";
import * as gr from "./gereedschap.js";
import {NavElement} from "./navigatie-animatie.js";

export default {
	zetEscapeKlikVoorAlles,
	afsluitingsAnimatieHandler
}

export function zetEscapeKlikVoorAlles() {
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
export function afsluitingsAnimatieHandler(){
	DB().alsVeranderdDoe('opslagProcedure', afsluitingsAnimatie)
}
function afsluitingsAnimatie(waarde, oudeWaarde) {
	console.log(waarde, oudeWaarde)
	const appBody = gr.el('app-body');
	if (waarde === 'voorbereiding'){
		appBody.classList.remove('succesvol', 'mislukt', 'herstarten')
		appBody.classList.add('lenin-poster');
		appBody.classList.add('formulier-weg');
	} 
	if (waarde === 'succesvol' || waarde === 'mislukt') {
		appBody.classList.add(`${waarde}-opgeslagen`);
	}

	if (waarde === 'mislukt') {
		appBody.classList.remove('lenin-poster');
	}

	if (oudeWaarde === 'succesvol' && waarde === 'herstarten') {
		appBody.classList.remove(`succesvol-opgeslagen`, `mislukt-opgeslagen`);
		appBody.classList.add('herstarten');
		setTimeout(()=>{
			appBody.classList.remove(`afsluiten`);
		}, 200)
	}
}