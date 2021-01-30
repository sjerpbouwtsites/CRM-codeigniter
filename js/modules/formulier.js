import PersoonRij from "./persoon-rij.js";
import { vindInOuders, formInvoerRijenArray } from "./gereedschap.js";

export default function formulierInit() {
	zetBewerkModusClick();

	willekeurigeGradientHoekrijen();
	zetSelectieFilterChange();
	zetClickSelectieOngedaan();
	zetClickGeneriekeSorteerOp();
}

/**
 * toggled de bewerk modus op de form-rij elememen
 */
function zetBewerkModusClick() {
	// zoek voor clicks op of in form-rij
	document.getElementById("form-rijen-lijst").addEventListener("click", (e) => {
		const formRij = vindInOuders(e.target, (element) => {
			return element.classList.contains("form-rij");
		});
		const bewerkend = document.querySelector(".bewerk-modus");
		if (bewerkend && bewerkend.id !== formRij.id) {
			bewerkend.classList.remove("bewerk-modus");
			(() => {
				new PersoonRij(bewerkend).schrijfDataNaarLeesVelden();
			})();
		}
		if (!formRij) {
			return;
		}

		!formRij.classList.contains("bewerk-modus") &&
			formRij.classList.add("bewerk-modus");
	});
}

function zetClickGeneriekeSorteerOp() {
	const sorteerKnopper = Array.from(
		document.querySelectorAll("button[data-sorteert]")
	);
	sorteerKnopper.forEach((knop) => {
		knop.addEventListener("click", generiekeSorteerOpHandler);
	});
}

function generiekeSorteerOpHandler(event) {
	if (!event.target.hasAttribute("data-sorteert")) {
		console.log(event);
		throw new Error("sorteren met waardeloze knop nee thx");
	}
	event.preventDefault();
	const knop = event.target;
	const sorteerOp = knop.getAttribute("data-sorteert");
	const startBij = knop.getAttribute("data-startBij");
	const persoonRijen = formInvoerRijenArray().map((rij) => new PersoonRij(rij));
	//
	persoonRijen.sort((persoonA, persoonB) => {
		return formRijenSorteerder(persoonA, persoonB, sorteerOp, startBij);
	});

	// en nu wegschrijven
	const nieuweRijenHTML = persoonRijen.map((persoonRij) => {
		return document.getElementById(persoonRij.id).outerHTML;
	});
	document.getElementById("form-rijen-lijst").innerHTML = `
	<div class="kop form-rij"></div>
	${nieuweRijenHTML.join("")}
	`;

	// volgorde op knop omdraaien & postfix (css) aanpassen
	const nieuweRichting = startBij === "laag" ? "hoog" : "laag";
	knop.setAttribute("data-startBij", nieuweRichting);
	const postFix =
		sorteerOp === "laatst_gezien"
			? nieuweRichting === "laag"
				? "Oud naar nieuw"
				: "Nieuw naar oud"
			: nieuweRichting === "laag"
			? "A - Z"
			: "Z - A";
	knop.setAttribute("data-postfix", postFix);
}

function formRijenSorteerder(persoonA, persoonB, sorteerVeldNaam, richting) {
	let veldWaardeBijA = persoonA[sorteerVeldNaam];
	let veldWaardeBijB = persoonB[sorteerVeldNaam];
	if (sorteerVeldNaam === "naam") {
		// nummers maken van eerste 3 letters
		veldWaardeBijA = veldWaardeBijA.toLowerCase();
		veldWaardeBijA = Number(
			`${veldWaardeBijA.charCodeAt(0).toString()}${veldWaardeBijA
				.charCodeAt(1)
				.toString()}${veldWaardeBijA.charCodeAt(2).toString()}`
		);
		veldWaardeBijB = veldWaardeBijB.toLowerCase();
		veldWaardeBijB = Number(
			`${veldWaardeBijB.charCodeAt(0).toString()}${veldWaardeBijB
				.charCodeAt(1)
				.toString()}${veldWaardeBijB.charCodeAt(2).toString()}`
		);
	}

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

function zetSelectieFilterChange() {
	$(".selectie-filter").on("change", function () {
		if (this.nodeName !== "SELECT") {
			throw new Error("geen idee wat hier nu weer gaande is pfff");
		}

		const laatstGekozenSelect = this;

		if (!laatstGekozenSelect.value) return;

		const stapelFiltersB = stapelFilters();

		let filterData = [];

		if (stapelFiltersB) {
			// we moeten de data van alle selects hebben.
			filterData = Array.from(laatstGekozenSelect.form)
				.filter((formElement) => {
					return formElement.classList.contains("selectie-filter");
				})
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
		} else {
			// alleen laatste select pakken.
			if (laatstGekozenSelect.selectedIndex === 0) {
				return; // hier gaat niets mee gebeuren.
			} else {
				const fm =
					laatstGekozenSelect.options[laatstGekozenSelect.selectedIndex].value;
				filterData.push({
					filterOp: laatstGekozenSelect.getAttribute("data-filter"),
					filterMet:
						!!fm && typeof fm !== "undefined" ? fm.toLowerCase() : null,
					splitRijWaarden: laatstGekozenSelect.hasAttribute("data-split"),
				});
			}
		}
		// nu per rij, per filterDataset, controleren.
		const rijenRes = Array.from(
			document.querySelectorAll(".form-rij + .form-rij")
		).map((rij) => {
			// array met bools en rij refs.
			const verzamelingBoolsofFiltersSucces = filterData.map(
				({ filterOp, filterMet, splitRijWaarden }) => {
					if (!splitRijWaarden) {
						// eenvoudige vergelijking
						return (
							rij
								.querySelector(`[data-naam=${filterOp}]`)
								.value.toLowerCase() === filterMet
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
	});
}

function zetClickSelectieOngedaan() {
	// form native reset zorgt voor reset van filters e.d. hier alleen hide show
	document
		.getElementById("reset-navs-en-toon-alles")
		.addEventListener("click", (e) => {
			document.querySelectorAll(".form-rij + .form-rij").forEach((rij) => {
				rij.style.display = "flex";
			});
		});
}

function willekeurigeGradientHoekrijen() {
	document.querySelectorAll(".form-rij + .form-rij").forEach((rij) => {
		const hoek = Math.floor(Math.random() * 360);
		rij.style.background = `linear-gradient(${hoek}deg, rgba(213, 189, 180, 0.44), rgba(180, 147, 147, 0.47))`;
	});
}
