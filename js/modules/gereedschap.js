
import PersoonRij from "./persoon-rij.js";

// #region grote tabel queries 

/**
 * @returns Array<NodeList> lijst van alle invoervelden in crm form.
 * @throws
 */
export function formInvoerVeldenArray() {
	try {
		return Array.from(document.querySelectorAll(".pers-input"));
	} catch (error) {
		console.error("gezocht naar .pers-input maar niets te vinden!");
		throw error;
	}
}

/**
 * @returns Array<NodeList> lijst van alle rijen na de kop. invoervelden in crm form.
 * @throws
 */
export function formInvoerRijenArray () {
		try {
			return Array.from(document.querySelectorAll(".form-rij"));
		} catch (error) {
			console.error("gezocht naar .form-rij maar niets te vinden!");
			throw error;
		}
	}

/**
 * PersoonRijen die zichtbaar zijn (bv ivm selectie)
 * @returns {array<PersoonRij>} array met persoonRijen
 */
export function zichtbarePersRijen() {
	const persRijenArr = formInvoerRijenArray();
	return persRijenArr
		.map((rij) => {
			return new PersoonRij(rij);
		})
		.filter((P) => {
			return P.inSelectie();
		});
}
// #endregion grote tabel queries

// #region domqueries

/**
 * Als zoek op id, ret elementById
 * Als zoek op selector, ret querySelector
 * Als gegeven zoekIn, zoek daar in. dus zoekIn.querySelector
 * Als niet gevonden, error
 *
 * @param {string} zoekOp
 * @param {HTMLElement} zoekIn
 * @returns {HTMLElement} element.
 */
export function pakElementVeilig(zoekOp, zoekIn = document) {
	if (!zoekOp) {
		throw new Error('pak element met lege query')
	}
	let el;

	if (zoekOp[0].match(/\w/)) {
		el = document.getElementById(zoekOp);
	} else {
		el = zoekIn.querySelector(zoekOp);
	}
	if (!el) {
		throw new Error(`Geen element ${zoekOp} gevonden`)
	} else {
		return el;
	}
}

/**
 * alias voor pakElementVeilig
 *
 * @see pakElementVeilig
 * @param {*} argumenten
 * @returns
 */
 export function el(...argumenten){
	return pakElementVeilig(argumenten)
}

/**
 * doorzoekt ouders voor element.
 * @param {HTMLElement} startElement
 * @param {function<boolean>} conditionFunc controleert huidige element aan conditie
 * @param {number} [maxRecursion=5] max aantal stappen omhoog.
 * @returns {HTMLElement|null} html element by success or null.
 */
 export function vindInOuders(startElement, conditionFunc, maxRecursion = 5) {
	if (conditionFunc(startElement)) {
		return startElement;
	}
	let werkEl = startElement.parentNode;
	let teller = 0;
	while (teller < maxRecursion) {
		// console.log("teller", teller);
		// gevonden? return.
		if (conditionFunc(werkEl)) {
			// console.log("gevonden!");
			return werkEl;
		}
		const tParent = werkEl.parentNode;
		// zijn we al op body?

		if (!tParent || tParent.id === "app-body") {
			//   console.log("mis!");
			return null;
		}
		// nog een cirkel.
		werkEl = tParent;
		teller = teller + 1;
	}
	return null;
}

// #endregion domqueries

// #region foutafhandeling
/**
 * maakt origin key/string; zet nieuwe waarde.
 * @param {string} origin
 * @param {Error} error
 */
 export default  function addErrorOrigin(origin, error) {
	if (!origin || !error) {
		throw new Error("add Error Origin faal");
	}

	if (!(error instanceof Error)){
		console.log(error)
		throw new Error('er gaat iets mis in error afhandeling')
	}

	if (!error.origin) error.origin = "";
	error.origin = `${origin}\n${error.origin}`;
	return error;
}
// #endregion foutafhandeling

// #region communicatie naar user
/**
 * 
 *
 * @param {string} tekst
 * @param {bool} isVanEvent
 */
 export function schrijfNaarClipboard(tekst, isVanEvent) {
	if (!isVanEvent) {
		
		gr.el(
			"copyboard-succes"
		).innerHTML = `Clipboard kon niet gebruikt worden omdat lijst niet door gebruiker zelf werd aangeroepen`;
	}
	navigator.clipboard
		.writeText(tekst)
		.then(() => {
			gr.el(
				"copyboard-succes"
			).innerHTML = `Addressen of script naar clipboard gekopieerd (je hoeft niet te kopie&euml;ren)`;
		})
		.catch(() => {
			gr.el(
				"copyboard-succes"
			).innerHTML = `Clipboard werkt niet. Heb je toevallig een Apple 😶`;
		});
}

export function communiceer(tekst, tijd) {
	const printerParagraph = document.querySelector('#printer p');
	const printer = document.querySelector('#printer');
	printerParagraph.innerHTML = tekst;
	printer.style.display = "block";

	if (tijd) {
		setTimeout(function () {
			printer.style.display = "none";
		}, tijd);
	}
}
// #endregion communicatie naar user

