
import PersoonRij from "./persoon-rij.js";

Array.prototype.getUnique = function () {
	var o = {},
		a = [],
		i,
		e;
	for (i = 0; (e = this[i]); i++) {
		o[e] = 1;
	}
	for (e in o) {
		a.push(e);
	}
	return a;
};

export function verwerkFout(err, voorvoeging) {
	var vv =
		typeof voorvoeging !== undefined && voorvoeging
			? "Het is mislukt want "
			: "";

	return (
		vv +
		err.message.replace("not defined", "ongedefinieerd") +
		" op regel " +
		err.lineNumber +
		"."
	);
}

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

/**
 * maakt origin key/string; zet nieuwe waarde.
 * @param {string} origin
 * @param {Error} error
 */
export  function addErrorOrigin(origin, error) {
	if (!origin || !error) {
		throw new Error("add Error Origin faal");
	}
	if (!error.origin) error.origin = "";
	error.origin = `${origin}\n${error.origin}`;
	return error;
}

const HTMLElementNames = ["a","abbr","abbr","address","embed","object","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","ul","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1toh6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","del","s","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"]

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

export function alsOpLocalHostOnthoudDecrypieEnVoerIn () {
		if (!location.href.includes("localhost")) return;
		try {
			const opgeslagenWW = localStorage.getItem("crm-decryptie");
			if (!opgeslagenWW) {
				document
					.getElementById("ontsleutel")
					.addEventListener("change", function () {
						localStorage.setItem(
							"crm-decryptie",
							document.getElementById("ontsleutel").value
						);
					});
				return;
			} else {
				document.getElementById("ontsleutel").value = opgeslagenWW;
				document.getElementById("ontsleutel-knop").click();
			}
		} catch (err) {
			communiceer("Iets gaat mis bij auto-decrypt.");
			console.error(err);
		}
		communiceer("auto-decrypt", 200);
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

export function welkomstWoord() {
	//filters e.d. vullen met nieuwe info

	const locationSplit = location.pathname.trim().split('/');
	const tabelNaam = location.pathname.includes('tabel') 
		? locationSplit[locationSplit.length-1] 
		: 'leden'

	setTimeout(()=>{
		communiceer(`CRM geinitialiseerd. Je bent op ${tabelNaam}`, 2500);
	}, 500)	
}