import * as gr from "./gereedschap.js";

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
	 * element rij ref
	 */
	element = null;

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
		this.element = rij;
		this.inputsNaarData(rij);
		const proxy = this.maakVanZelfProxy();
		this.proxySet = true;
		return proxy;
	}

	/**
	 * neemt laatst gezien uit data, maakt het amerikaans, dan unix.
	 *
	 * @readonly
	 * @memberof PersoonRij
	 */
	get laatstGezienDate() {
		const l = document.getElementById(`pers-${this.naamIdMap.laatst_gezien}`).value;

		return !!l ?
			new Date(l.split("-").reverse())
			: false;
	}

	get afgelopenHalfJaarGezien() {
		const u = this.laatstGezienDate;
		if (!u) {
			return false
		}
		const vandaag = new Date();
		const halfJaarNaLaatstGezien = new Date(u.setMonth(u.getMonth() + 6)).getTime();
		return halfJaarNaLaatstGezien > vandaag;
	}

	get heeftGeldigeTel() {
		return document.getElementById(`pers-${this.naamIdMap.telefoon}`).value.length >= 10;
	}

	get heeftGeldigeEmail() {
		const v = document.getElementById(`pers-${this.naamIdMap.email}`).validity;
		return !v.valueMissing && !v.typeMismatch;
	}

	/**
	 * vult (voor maken zelf proxy) de private stores.
	 *
	 * @param {HTMLElement} rij
	 */
	inputsNaarData(rij) {
		gr.elArray(".pers-input", rij).forEach((invoerVeld) => {
			const naam = invoerVeld.getAttribute("data-naam");
			const waarde = invoerVeld.value;
			this._data[naam] = waarde;
			this.namen.push(naam);
			this.naamIdMap[naam] = invoerVeld.id.replace("pers-", "");
		});
	}

	/**
	 * Of iemand geen email heeft, tel, 
	 * of te lang niet gezien is.
	 */
	zetPersoonsLabels() {

		const tel = this.heeftGeldigeTel
		const mail = this.heeftGeldigeEmail;
		const tijd = this.afgelopenHalfJaarGezien;
		const labelCel = this.element.querySelector('.cel-labels')

		labelCel.innerHTML = '';

		if (!tel || !mail || !tijd) {
			//	this.element.classList.add('heeft-labels')
			labelCel.classList.remove('verborgen')
		} else {
			//		this.element.classList.remove('heeft-labels')
			labelCel.classList.add('verborgen')
			return;
		}

		let labelHTML = '';
		if (!tel) {
			labelHTML += "<span title='telefoonnummer ontbreekt of is ongeldig' class='persoon-label label-tel'></span>"
		}
		if (!mail) {
			labelHTML += "<span title='email ontbreekt of is ongeldig' class='persoon-label label-mail'></span>"
		}
		if (!tijd) {
			labelHTML += "<span title='deze persoon is lang niet gezien' class='persoon-label label-tijd'></span>"
		}
		labelCel.innerHTML = labelHTML
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
				"element",
				"naamIdMap",
				"schrijfDataNaarLeesVeldenEnZetGeenDataClass",
				"laatstGezienDate",
				"heeftGeldigeEmail",
				"heeftGeldigeTel",
				"afgelopenHalfJaarGezien",
				"zetPersoonsLabels"
			].includes(sleutelNaam)
		) {
			return false;
		}

		if (!this.namen.includes(sleutelNaam)) {
			throw new Error(
				`dit is helemaal fout om een of andere reden mss wel een symbol geen bestaande input. Sleutelnaam: ${sleutelNaam}`
			);
		}
		return true;
	}

	/**
	 * of de PersoonRij getoond wordt. Checkt display none;
	 * Als in handmatigeSelectieModus, dan dat ook controleren. 
	 *
	 * @returns {boolean} of wordt getoond.
	 */
	inSelectie(handmatigeSelectieModus = false) {
		const s = this.element.getAttribute("style") || "";
		if (s.replace(/\W/g, "").includes("displaynone")) {
			return false;
		}
		if (handmatigeSelectieModus) {
			return this.element.classList.contains('in-handmatige-selectie')
		}

		return true;
	}

	/**
	 * Aanroepen om vanuit de data de tekst elementen opnieuw te vullen.
	 */
	schrijfDataNaarLeesVeldenEnZetGeenDataClass() {
		Object.entries(this.naamIdMap).forEach(([naam, idBasis]) => {
			const leesId = `lees-${idBasis}`;
			const inputId = `pers-${idBasis}`;
			const print = this._data[naam];

			gr.el(leesId).innerHTML = print;
			if (print.trim().length === 0) {
				gr.el(inputId).classList.add("geen-data");
			} else {
				gr.el(inputId).classList.remove("geen-data");
			}
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
			// zet geen-dataclass op input
			set(geproxiedObject, sleutel, waarde) {
				geproxiedObject.sleutelCheck(sleutel); // zie boven
				geproxiedObject._data[sleutel] = waarde;
				const inputId = `pers-${geproxiedObject.naamIdMap[sleutel]}`;
				const input = gr.el(inputId);
				input.value = waarde;
				return true;
			},
		});
	}
}
