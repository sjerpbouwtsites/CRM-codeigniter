import * as gr from "../gereedschap.js";
//import {NavElement} from "../navigatie-animatie.js";


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
	const persoonRijen = gr.formInvoerRijenArray().map((rij) => new PersoonRij(rij));
	//
	persoonRijen.sort((persoonA, persoonB) => {
		return formRijenSorteerder(persoonA, persoonB, sorteerOp, startBij);
	});

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

function formRijenSorteerder(persoonA, persoonB, sorteerVeldNaam, richting) {
	let veldWaardeBijA = persoonA[sorteerVeldNaam];
	let veldWaardeBijB = persoonB[sorteerVeldNaam];
	if (sorteerVeldNaam === "naam") {
		// nummers maken van eerste 5 letters
		veldWaardeBijA = veldWaardeBijA.toLowerCase();
		veldWaardeBijA = Number(
			veldWaardeBijA
				.substring(0, 5)
				.padEnd(5, "a")
				.split("")
				.map((naamLetter) => naamLetter.charCodeAt(0).toString())
				.join("")
		);
		veldWaardeBijB = Number(
			veldWaardeBijB
				.substring(0, 5)
				.padEnd(5, "a")
				.split("")
				.map((naamLetter) => naamLetter.charCodeAt(0).toString())
				.join("")
		);
	} else if (sorteerVeldNaam === "laatst_gezien") {
		console.log(veldWaardeBijA)
		veldWaardeBijA = veldWaardeBijA.split('-').reverse().join('')
		veldWaardeBijB = veldWaardeBijB.split('-').reverse().join('')
	}

	veldWaardeBijA = Number(veldWaardeBijA)
	veldWaardeBijB = Number(veldWaardeBijB)

	if (richting === "hoog") {
		if (veldWaardeBijA > veldWaardeBijB) {
			return -1;
		}
		if (veldWaardeBijA < veldWaardeBijB) {
			return 1;
		}
	} else {
		if (veldWaardeBijA < veldWaardeBijB) {
			return -1;
		}
		if (veldWaardeBijA > veldWaardeBijB) {
			return 1;
		}
	}

	return 0;
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