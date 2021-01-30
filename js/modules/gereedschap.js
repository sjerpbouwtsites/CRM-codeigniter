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

export class PersoonRij {
	/**
	 * @param {HTMLElement} rij
	 */
	constructor(rij) {
		if (!rij.classList || !rij.classList.contains("form-rij")) {
			throw new Error("PersoonRij gemaakt met iets dat geen rij is..");
		}
		if (rij.classList.contains("kop")) {
			throw new Error("PersoonRij gemaakt met kopregel");
		}
		this._data = {};
		this._namen = [];
		this._naamIdMap = {};
		this.id = rij.id;
		this.inputsNaarData(rij);
		return this.maakVanZelfProxy();
	}

	inputsNaarData(rij) {
		Array.from(rij.querySelectorAll(".pers-input")).forEach((invoerVeld) => {
			const naam = invoerVeld.getAttribute("data-naam");
			const waarde = invoerVeld.value;
			this._data[naam] = waarde;
			this._namen.push(naam);
			this._naamIdMap[naam] = invoerVeld.id;
		});
	}

	/**
	 * true als uit data halen, false als uit obj zelf halen.
	 *
	 * @param {*} sleutelNaam
	 * @memberof PersoonRij
	 */
	sleutelCheck(sleutelNaam) {
		if (["inSelectie", "id"].includes(sleutelNaam)) {
			return false;
		}
		if (sleutelNaam.startsWith("_")) {
			throw new Error(`${sleutelNaam} is prive.`);
		}
		if (!this._namen.includes(sleutelNaam)) {
			throw new Error(`${sleutelNaam} geen bestaande input.`);
		}
		return true;
	}

	inSelectie() {
		const s = document.getElementById(this.id).getAttribute("style") || "";
		if (s.replace(/\W/g, "").includes("displaynone")) {
			return false;
		}
		return true;
	}

	maakVanZelfProxy() {
		return new Proxy(this, {
			get(geproxiedObject, sleutel) {
				if (geproxiedObject.sleutelCheck(sleutel)) {
					return geproxiedObject._data[sleutel];
				} else {
					return geproxiedObject[sleutel];
				}
			},
			set(geproxiedObject, sleutel, waarde) {
				geproxiedObject.sleutelCheck(sleutel);
				geproxiedObject._data[sleutel] = waarde;
				const inputId = geproxiedObject._naamIdMap[sleutel];
				document.getElementById(inputId).value = waarde;
			},
		});
	}
}
