/**
 * ease-of-access wrapper om form-rij heen.
 * Lees / zet inputs alsof ze properties zijn van de instance
 * werkt via een proxy zodat je gewoon inputs kan setten & getten alsof het inputs zelf zijn oid.
 * dus bv PersRijInst.email = 'harry@dfdgfdf.nl'
 *
 * @class PersoonRij
 */
export default class PersoonRij {
	/**
	 * input-name input value mapping
	 * @private
	 */
	_data = {};

	/**
	 * zal alle namen van inputs bevatten
	 */
	namen = [];

	/**
	 * input-name input-id (zonder voorvoeging) mapping.
	 */
	naamIdMap = {};

	/**
	 * de id van de form-rij zelf.
	 */
	id = null;

	proxySet = false;

	/**
	 * @param {HTMLElement} rij
	 * @returns {Proxy<PersoonRij>} geproxiede PersoonRij.
	 */
	constructor(rij) {
		if (!rij.classList || !rij.classList.contains("form-rij")) {
			throw new Error("PersoonRij gemaakt met iets dat geen rij is..");
		}
		if (rij.classList.contains("kop")) {
			throw new Error("PersoonRij gemaakt met kopregel");
		}

		this.id = rij.id;
		this.inputsNaarData(rij);
		const proxy = this.maakVanZelfProxy();
		this.proxySet = true;
		return proxy;
	}

	/**
	 * vult (voor maken zelf proxy) de private stores.
	 *
	 * @param {HTMLElement} rij
	 */
	inputsNaarData(rij) {
		Array.from(rij.querySelectorAll(".pers-input")).forEach((invoerVeld) => {
			const naam = invoerVeld.getAttribute("data-naam");
			const waarde = invoerVeld.value;
			this._data[naam] = waarde;
			this.namen.push(naam);
			this.naamIdMap[naam] = invoerVeld.id.replace("pers-", "");
		});
	}

	/**
	 * true als uit data halen, false als uit obj zelf halen.
	 *
	 * @param {string} sleutelNaam
	 * @throws als je probeer een private property te lezen of, na de toegestane sleutels check, is het geen bestaande input-name sleutel (ofzo k)
	 */
	sleutelCheck(sleutelNaam) {
		if (
			[
				"inSelectie",
				"_data",
				"id",
				"naamIdMap",
				"schrijfDataNaarLeesVelden",
			].includes(sleutelNaam)
		) {
			return false;
		}
		if (!this.namen.includes(sleutelNaam)) {
			throw new Error(`${sleutelNaam} geen bestaande input.`);
		}
		return true;
	}

	/**
	 * of de PersoonRij getoond wordt. Checkt display none;
	 *
	 * @returns {boolean} of wordt getoond.
	 */
	inSelectie() {
		const s = document.getElementById(this.id).getAttribute("style") || "";
		if (s.replace(/\W/g, "").includes("displaynone")) {
			return false;
		}
		return true;
	}

	/**
	 * Aanroepen om vanuit de data de tekst elementen opnieuw te vullen.
	 */
	schrijfDataNaarLeesVelden() {
		Object.entries(this.naamIdMap).forEach(([naam, idBasis]) => {
			const leesId = `lees-${idBasis}`;
			document.getElementById(leesId).innerHTML = this._data[naam];
		});
	}

	/**
	 * maakt proxy van eigen object zodat gets en sets gecontroleerd worden.
	 */
	maakVanZelfProxy() {
		return new Proxy(this, {
			get(geproxiedObject, sleutel) {
				// bepaald dus of gekeken dient te worden in _data of directe methodes / properties gelezen moeten worden.
				const sleutelCheckRes = geproxiedObject.sleutelCheck(sleutel);
				if (sleutelCheckRes) {
					return geproxiedObject._data[sleutel];
				} else {
					return geproxiedObject[sleutel];
				}
			},
			// zet de private stores
			// zet de bijpassen de input.
			set(geproxiedObject, sleutel, waarde) {
				geproxiedObject.sleutelCheck(sleutel); // zie boven
				geproxiedObject._data[sleutel] = waarde;
				const inputId = geproxiedObject.naamIdMap[sleutel];
				document.getElementById(inputId).value = waarde;
				return true;
			},
		});
	}
}
