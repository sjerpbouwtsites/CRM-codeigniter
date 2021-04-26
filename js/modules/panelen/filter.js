import * as gr from "../gereedschap.js";
import PersoonRij from "../persoon-rij.js";


export default function (){
  vulSelects ()
  zetClickGeneriekeSorteerOp()
  zetSelectieFilterChange()
  zetClickSelectieOngedaan()
}

//#region sorteren
/**
 * Zet generiekeSorteerOpHandler op de click van de sorteerknoppen.
 */
 function zetClickGeneriekeSorteerOp() {
	gr.elArray("button[data-sorteert]").forEach((knop) => {
		knop.addEventListener("click", generiekeSorteerOpHandler);
	});
}

function generiekeSorteerOpHandler(event) {
	if (!event.target.hasAttribute("data-sorteert")) {
		throw new Error("sorteren met waardeloze knop nee thx");
	}
	event.preventDefault();
	const knop = event.target;
	const sorteerOp = knop.getAttribute("data-sorteert");
	const startBij = knop.getAttribute("data-startBij");
	let persoonRijen = gr.formInvoerRijenArray().map((rij) => new PersoonRij(rij));
	
	persoonRijen = sorteerRijen[sorteerOp](persoonRijen, startBij);

	// en nu wegschrijven
	const nieuweRijenHTML = persoonRijen.map((persoonRij) => {
		return document.getElementById(persoonRij.id).outerHTML;
	});
	document.getElementById("form-rijen-lijst").innerHTML = `
	${nieuweRijenHTML.join("")}
	`;

	// volgorde op knop omdraaien & postfix (css) aanpassen
	const nieuweRichting = startBij === "laag" ? "hoog" : "laag";
	knop.setAttribute("data-startBij", nieuweRichting);
	const postFix =
		sorteerOp === "laatst_gezien"
			? nieuweRichting === "laag"
			?  "Nieuw naar oud"
				: "Oud naar nieuw"
			: nieuweRichting === "laag"
			? "A - Z"
			: "Z - A";
	knop.setAttribute("data-postfix", postFix);
}

const sorteerRijen = {
	naam: (rijen, richting) =>{
		const gesorteerd = rijen.sort( (a, b) => {
			return a.naam.localeCompare(b.naam, 'nl', {ignorePunctuation: true})
		});
		return richting === 'hoog' ? gesorteerd : gesorteerd.reverse();
	},
	laatst_gezien: (rijen, richting) => {
		const gesorteerd = rijen.sort((a, b) => {

			const [dagenA, maandenA, jarenA] = a.laatst_gezien.length ? a.laatst_gezien.split('-') : "01-05-2016";
			const [dagenB, maandenB, jarenB] = b.laatst_gezien.length ? b.laatst_gezien.split('-') : "01-05-2016";
			const dagenATotaal = Number(dagenA) + Number(maandenA*30) + Number(jarenA*365)
			const dagenBTotaal = Number(dagenB) + Number(maandenB*30) + Number(jarenB*365)
			console.log(dagenA, dagenB, dagenATotaal, dagenBTotaal)
			return dagenATotaal > dagenBTotaal;
		});
		return richting === 'hoog' ? gesorteerd.reverse() : gesorteerd;
	}
}

//#endregion sorteren

/**
 * zet draaiSelectieFilters op change op alle selectieFilters
 *
 */
function zetSelectieFilterChange() {
	document.getElementById("crm-nav-filters").addEventListener("change", (e) => {
		if (!e.target.hasAttribute("data-filter")) {
			return;
		}
		e.preventDefault();
		draaiSelectieFilters();
	});
}

/**
 * filters draaien allemaal tegelijk, onafhankelijk van events
 */
function draaiSelectieFilters() {
	// we moeten de data van alle selects hebben.
	const filterData = gr.elArray("select[data-filter]")
		.filter((selectElement) => {
			// nu diegeen er uit halen die geen keuze hebben, oftewel selectedIndex 0.
			return selectElement.selectedIndex !== 0;
		})
		.map((selectElement) => {
			// nu array maken met filter waardes voor controle
			// plus welke het laatst gewijzigd is.
			return {
				filterOp: selectElement.getAttribute("data-filter"), // de sleutel waarop gefilterd moet worden
				filterMet: selectElement.options[
					selectElement.selectedIndex
				].value.toLowerCase(),
				splitRijWaarden: selectElement.hasAttribute("data-split"),
			};
		});

	// nu per rij, per filterDataset, controleren.
	const rijenRes = gr.formInvoerRijenArray().map((rij) => {
		// array met bools en rij refs.
		const verzamelingBoolsofFiltersSucces = filterData.map(
			({ filterOp, filterMet, splitRijWaarden }) => {
				if (!splitRijWaarden) {
					// eenvoudige vergelijking
					return (
						rij.querySelector(`[data-naam=${filterOp}]`).value.toLowerCase() ===
						filterMet
					);
				} else {
					// een van de waarden in de rij-input moet overeen komen.
					return rij
						.querySelector(`[data-naam=${filterOp}]`)
						.value.toLowerCase()
						.split(" ")
						.includes(filterMet);
				}
			}
		);
		// als alles in de verzameling true is zijn alle filters succesvol.
		return {
			rij,
			succes: !verzamelingBoolsofFiltersSucces.includes(false),
		};
	});
	rijenRes.forEach(({ rij, succes }) => {
		rij.style.display = succes ? "flex" : "none";
	});
}

function zetClickSelectieOngedaan() {
	// form native reset zorgt voor reset van filters e.d. hier alleen hide show
	document
		.getElementById("reset-navs-en-toon-alles")
		.addEventListener("click", (e) => {
			gr.formInvoerRijenArray().forEach((rij) => {
				rij.style.display = "flex";
			});
		});
}

function vulSelects () {
	gr.elArray(".selectie-filter").forEach(
		(selectElement) => {
			const filtert = selectElement.getAttribute("data-filter");
			const moetGesplit = selectElement.getAttribute("data-split");
			const invoerVeldenValues = gr.elArray(`.pers-input[data-naam='${filtert}']`)
				.map((veld) => veld.value)
				.map((veldValue) => {
					if (moetGesplit) {
						return veldValue.split(" ");
					} else {
						return veldValue;
					}
				})
				.sort()
				.reverse();

			const uniekeWaarden = [];
			invoerVeldenValues.forEach((v) => {
				if (!v) {
					return;
				}
				if (typeof v === "string") {
					if (!uniekeWaarden.includes(v)) {
						uniekeWaarden.push(v);
					}
				} else {
					// dus array
					v.forEach((w) => {
						if (!uniekeWaarden.includes(w)) {
							uniekeWaarden.push(w);
						}
					});
				}
			});

			const icon = Math.random() > 0.5 ? "🔎" : "🔍";

			selectElement.innerHTML = `
					<option value=''>${filtert} <span class='select-icon'>${icon}</span></option>
					${uniekeWaarden
						.map((optie) => {
							return `<option value='${optie}'>${optie}</option>`;
						})
						.join("")}
				`;
		}
	);
}