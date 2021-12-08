import DB from "./database.js";
import * as gr from "./gereedschap.js";
import { NavElement } from "./navigatie-animatie.js";

export default {
	zetEscapeKlikVoorAlles,
	afsluitingsAnimatieHandler,
	naOpslaanHerlaadfunctionaliteit,
	laadEvtAndereBladen
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
export function afsluitingsAnimatieHandler() {
	DB().alsVeranderdDoe('opslagProcedure', afsluitingsAnimatie)
}
function afsluitingsAnimatie(waarde, oudeWaarde) {
	const appBody = gr.el('app-body');
	if (waarde === 'voorbereiding') {
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
		setTimeout(() => {
			appBody.classList.remove(`afsluiten`);
		}, 200)
	}
}

export function naOpslaanHerlaadfunctionaliteit() {
	DB().alsVeranderdDoe('opslagProcedure', (huidigeWaardeOpslag) => {
		if (huidigeWaardeOpslag !== 'succesvol') {
			console.dir(DB())
			return;
		}

		localStorage.setItem('herladen-met-wachtwoord', DB().wachtwoord)
		const huidigeUser = document.getElementById('huidige-user').value;
		localStorage.setItem('user', huidigeUser);
		let herlaadLink = new URL('', location.href);
		herlaadLink.searchParams.set('user', huidigeUser);
		const d = new Date();
		herlaadLink.searchParams.set('willekeurigeData', d.getTime());
		herlaadLink.hash = 'herladen-met-wachtwoord';
		document.getElementById('herlaad-pagina-knop').href = herlaadLink;

		setTimeout(() => {
			gr.pakElementVeilig('herlaad-pagina-knop').classList.remove('verborgen');
		}, 2500)
	})



	// document.getElementById('herlaad-pagina-knop').addEventListener('click', e => {
	// 	e.preventDefault();
	// 	location.hash = 'herladen-met-wachtwoord';
	// 	gr.communiceer('gaat herladen', 500);
	// 	alert('fdfd')
	// 	setTimeout(() => {

	// 	}, 500);
	// })
}

/**
 * checkbox op ontsleutelscherm. Bepaalt of alleen dit blad geopend gaat
 * worden of dat de andere twee bladen ook geopend moeten worden. 
 */
export function laadEvtAndereBladen() {

	if (!document.getElementById('open-andere-bladen').checked) {
		return;
	}
	const base = location.href + (location.href.includes('localhost') ? 'index.php/' : '');
	const huidigeUser = document.querySelector('[name="form_meta[user]"').value;
	setTimeout(() => {
		window.open(base + `categorie/contacten?user=${huidigeUser}#herladen-met-wachtwoord`);
	}, 250)
	setTimeout(() => {
		window.open(base + `categorie/bondgenoten?user=${huidigeUser}#herladen-met-wachtwoord`);
	}, 500)
}
