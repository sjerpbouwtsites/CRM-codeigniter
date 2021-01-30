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

export var verwerkFout = ESMMigratieGlobalCheck(
	"verwerkFout",
	function verwerkFout(err, voorvoeging) {
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
);

/**
 * @returns Array<NodeList> lijst van alle invoervelden in crm form.
 * @throws
 */
export var formInvoerVeldenArray = ESMMigratieGlobalCheck(
	"formInvoerVeldenArray",
	function () {
		try {
			return Array.from(document.querySelectorAll(".pers-input"));
		} catch (error) {
			console.error("gezocht naar .pers-input maar niets te vinden!");
			throw error;
		}
	}
);

/**
 * @returns Array<NodeList> lijst van alle rijen na de kop. invoervelden in crm form.
 * @throws
 */
export var formInvoerRijenArray = ESMMigratieGlobalCheck(
	"formInvoerRijenArray",
	function () {
		try {
			return Array.from(document.querySelectorAll(".form-rij + .form-rij"));
		} catch (error) {
			console.error("gezocht naar .form-rij maar niets te vinden!");
			throw error;
		}
	}
);

/**
 * maakt origin key/string; zet nieuwe waarde.
 * @param {string} origin
 * @param {Error} error
 */
export var addErrorOrigin = ESMMigratieGlobalCheck(
	"addErrorOrigin",
	function (origin, error) {
		if (!origin || !error) {
			throw new Error("add Error Origin faal");
		}
		if (!error.origin) error.origin = "";
		error.origin = `${origin}\n${error.origin}`;
		return error;
	}
);

export var alsOpLocalHostOnthoudDecrypieEnVoerIn = ESMMigratieGlobalCheck(
	"alsOpLocalHostOnthoudDecrypieEnVoerIn",
	function () {
		if (!staat.dev) return;
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
);

/**
 * Tijdens omschakelen naar ESM alles van window[func] naar export/imports.
 * Indien func nog global aanwezig, warning en return global func.
 * Anders geef terug funcDeclaratie.
 * Gebruikt ipv bij export function blablaFunc(){}
 *
 * @export
 * @param {string} funcNaam te checken of die al global aanwezig is.
 * @param {function} funcDeclaratie eigenlijke functie.
 * @returns {function} global of nieuwe functie.
 */
export function ESMMigratieGlobalCheck(funcNaam, funcDeclaratie) {
	if (typeof window[funcNaam] === "function") {
		console.warn(`${funcNaam} func al gezet`);
		return window[funcNaam];
	} else {
		return funcDeclaratie;
	}
}

export var communiceer = ESMMigratieGlobalCheck(
	"communiceer",
	function (tekst, tijd) {
		$("#printer p").empty().append(tekst);
		$("#printer").fadeIn(200);
		/*	printer.getElementsByTagName('p')[0].textContent = tekst;
    printer.style.display = "block";*/

		if (tijd) {
			setTimeout(function () {
				$("#printer").fadeOut(200);
			}, tijd);
		}
	}
);

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
