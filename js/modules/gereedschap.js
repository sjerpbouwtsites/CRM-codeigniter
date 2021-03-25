
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