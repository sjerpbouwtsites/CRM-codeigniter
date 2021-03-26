
import PersoonRij from "./persoon-rij.js";

// #region grote tabel queries 

/**
 * @returns Array<NodeList> lijst van alle invoervelden in crm form.
 * @throws
 */
export function formInvoerVeldenArray() {
	return elArray(".pers-input");
}

/**
 * @returns Array<NodeList> lijst van alle rijen na de kop. invoervelden in crm form.
 * @throws
 */
export function formInvoerRijenArray () {
	return elArray(".form-rij");

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
 * return Array.from(doc.query)
 * Als gegeven zoekIn, zoek daar in. dus zoekIn.querySelector
 *
 * @param {string} zoekOp
 * @param {HTMLElement} zoekIn
 * @returns {Array} HTML element array.
 */
 export function pakElementenLijstVeilig(zoekOp, zoekIn = document) {
	if (!zoekOp) {
		throw new Error('pak elementen lijst met lege query')
	}
	
	const elementenLijst = zoekIn.querySelectorAll(zoekOp);
	if (!elementenLijst) {
		return [];
	}
	return Array.from(elementenLijst)

}

/**
 * alias voor pakElementenLijstVeilig
 *
 * @see pakElementenLijstVeilig
 * @param {*} argumenten
 * @returns
 */
 export function elArray(zoekOp, zoekIn){
	return pakElementenLijstVeilig(zoekOp, zoekIn)
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
		
		pakElementVeilig(
			"copyboard-succes"
		).innerHTML = `Clipboard kon niet gebruikt worden omdat lijst niet door gebruiker zelf werd aangeroepen`;
	}
	navigator.clipboard
		.writeText(tekst)
		.then(() => {
			pakElementVeilig(
				"copyboard-succes"
			).innerHTML = `Addressen of script naar clipboard gekopieerd (je hoeft niet te kopie&euml;ren)`;
		})
		.catch(() => {
			pakElementVeilig(
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

export function schrijfVandaagNaarInput(input){
	var datumInstance = new Date();
	var vandaag =
	datumInstance.getDate() +
	"-" +
	(datumInstance.getMonth() + 1) +
	"-" +
	datumInstance.getFullYear();
	input.value = vandaag;
}