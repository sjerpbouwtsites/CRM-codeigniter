/** 'frontend' van enscryptie */

import * as encGr from "./encryptie-gereedschap.js";
import * as gr from "./gereedschap.js";
import DB from "./database.js";

// #region versleuteling

export function maakSleutelEnVersleutel(sleutelBasis) {
	return new Promise((resolveVersleutel, rejectVersleutel) => {

		gr.communiceer("versleutelen begonnen");

		encGr
		  .convertPassphraseToKey(sleutelBasis)
		  .then(function (encryptieSleutel) {
			
			var iv = window.crypto.getRandomValues(new Uint8Array(16));
			// schrijf naar tabel
			printIV.value = encGr.byteArrayToBase64(iv);
			// ieder veld encrypten
			const veldEncryptiePromises = gr.elArray(".pers-input")
			.map((veld) => {
				return new Promise((resolveVeld, rejectVeld) => {
					// encrypten
					veldEncryptie(iv, encryptieSleutel, veld.value.trim())
					// naar veld schrijven en stijlen
					.then((encryptiebuffer)=>{
						veldEncryptieThen(encryptiebuffer, veld)
					})
					// naar promises array
					.then(resolveVeld)
					// idem
					.catch((err) => {
						veldEncryptieCatch(err, veld);
						rejectVeld(err);
					});
				});
			});

			Promise.all(veldEncryptiePromises)
				.then(() => {
					gr.communiceer("versleutelen klaar", 1000);
					resolveVersleutel(true);
				})
				.catch((err) => {
					throw err; // naar versleutel catch
				});
		});
	}).catch(function (error) {
		gr.communiceer(encGr.verwerkFout(error, true));
		rejectVersleutel(error);
	});
}

/**
 * helper van maakSleutelEnVersleutel
 *
 * @param {*} iv
 * @param {*} encryptieSleutel
 * @param {*} veldWaarde
 * @returns {Promise<buffer>}
 */
function veldEncryptie(iv, encryptieSleutel, veldWaarde){
	return window.crypto.subtle.encrypt(
		{ name: "AES-CBC", iv: iv },
		encryptieSleutel,
		encGr.stringToByteArray(veldWaarde)
	)	
}

/**
 * helper van maakSleutelEnVersleutel
 * CATCH in mapper over velden + encryptie
 *
 * @param {*} err
 * @param {*} veld
 */
function veldEncryptieCatch(err, veld){
	const errMsg = `veld ${veld.getAttribute(
		"name"
	)} cijferen mislukt: ${err.message}\n`;
	gr.communiceer("fuck!");
	err.message = `${errMsg}${err.message}`;
}
/**
 * helper van maakSleutelEnVersleutel
 * THEN in mapper over velden + encryptie
 *
 * @param {*} encryptiebuffer
 * @return {Promise<boolean>}
 */
function veldEncryptieThen(encryptiebuffer, veld){
	return new Promise(resolve => {
		var encryptieBytes = new Uint8Array(encryptiebuffer);
		var base64encryptieTekst = encGr.byteArrayToBase64(encryptieBytes);
		veld.value = base64encryptieTekst;
		veld.classList.add("verborgen");
		resolve();
	})
}


function zetVerzendenInStukken () {
	const groteFormulier = gr.el("grote-tabel-formulier");
	const groteFormulierVerzendKnop = gr.el("verzend-grote-formulier-knop");
	groteFormulierVerzendKnop.addEventListener(
		"click",
		verzendInStukkenCallback
	);
	groteFormulier.addEventListener("submit", verzendInStukkenCallback);
}


function verzendInStukkenCallback(e) {
	e.preventDefault();
	//button disablen
	gr.el("verzend-grote-formulier-knop").setAttribute("disabled", true);
	// eerst versleutelen
	 
	if (!DB().wachtwoord) throw new Error("wachtwoord vergeten door app");
	maakSleutelEnVersleutel(DB().wachtwoord)
		.then(() => {
			DB().ontsleuteld = false;
			DB().opslagProcedure = 'voorbereiding'
			gr.communiceer("Versleuteld. Nu comprimeren en versturen.", 1000);
			const groteFormulier = gr.el("grote-tabel-formulier");
			const formDataSys = new FormData(groteFormulier);

			/**
			 * makkelijker te verzenden en beter te vertalen naar SQL
			 */
			const SQLVriendelijkePostData = {
				meta: {},
				ids: [],
				kolommen: [],
				waardenPerId: {},
			};
			// voor bereiden met de ids.
			Array.from(formDataSys.entries())
				.filter(([key, value]) => key.includes("[id]"))
				.forEach(([key, uniekeIdUitForm]) => {
					SQLVriendelijkePostData.ids.push(uniekeIdUitForm);
					SQLVriendelijkePostData.waardenPerId[uniekeIdUitForm] = [];
				});

			// kolommen bepalen
			const eersteId = SQLVriendelijkePostData.ids[0];
			const eersteRijInputs = document
				.querySelector(".form-rij")
				.querySelectorAll(".pers-input");
			SQLVriendelijkePostData.kolommen = Array.from(eersteRijInputs)
				.map((veld) => {
					return veld.getAttribute("data-naam");
				})
				.filter((veldNaam) => {
					return veldNaam !== "id";
				});

			// per id waardenPerId invullen.
			Array.from(formDataSys.entries()).forEach(([key, value]) => {
				if (key.includes("form_meta") || key.includes("[id]")) {
					return;
				}
				const id = key.replace(/\D/g, "");
				SQLVriendelijkePostData.waardenPerId[id].push(value);
			});

			// tenslotte de meta data
			SQLVriendelijkePostData.meta = {
				xsrf: formDataSys.get("form_meta[csrf-token]"),
				iv: formDataSys.get("form_meta[iv]"),
				tabel: formDataSys.get("form_meta[tabel_naam]"),
			};

			return axios
				.request({
					url: gr.el("grote-tabel-formulier").action,
					method: "post",
					data: SQLVriendelijkePostData,
				})
				.then((antwoord) => {
					// afsluiten
					DB().opslagProcedure = 'succesvol'

					gr.communiceer(
						`Gelukt! Server zegt: ${antwoord.data}. Dit programma sluit nu af.`,
						2000
					);
				})
				.catch((e) => {
					console.error(e);
					gr.communiceer(
						`En dat is een fout!
					De server zegt: ${e.message}`,
						5000
					);
					throw e;
				});
		}) // then van maakSleutelEnVersleutel
		.catch((e) => {
			gr.communiceer(`fout in de versleuteling ${e}`, 1000);
			DB().opslagProcedure = 'mislukt';
			throw e;
		});
}

// #endregion versleuteling

// #region ontsleutelen

/**
 * @returns Promise<Bool|Error>
 * @param {wachtwoord} sleutel
 */
export function maakSleutelEnOntsleutel(sleutel) {
	return new Promise((resolveOntsleutel, rejectOntsleutel) => {
		const ivBytes = encGr.base64ToByteArray(printIV.value.trim());

		encGr.convertPassphraseToKey(sleutel)
			.then(function (aesKey) {
				const veldDecryptiePromises = gr.formInvoerVeldenArray()
				.map((versleuteldVeld) => {
						return perVeldSleutelMapper({ aesKey, versleuteldVeld, ivBytes });
					}
				);
				return Promise.all(veldDecryptiePromises);
			})
			.then(() => {
				gr.communiceer("decryptie klaar", 1000);
				resolveOntsleutel(true);
			})
			.catch((error) => {
				`Gaat iets mis bij de ontsleuteling. ${error.message}`;
				rejectOntsleutel(error);
			});
	});
}

function perVeldSleutelMapper({ aesKey, versleuteldVeld, ivBytes }) {
	return new Promise((veldResolve, veldReject) => {
		new Promise((cipherResolve, cipherReject) => {
			if (
				!versleuteldVeld.value.length ||
				versleuteldVeld.getAttribute("data-naam") === "id"
			) {
				cipherResolve("");
			}
			let ciphertextBytes;

			ciphertextBytes = encGr.base64ToByteArray(versleuteldVeld.value);
			const decryptPromise = window.crypto.subtle
				.decrypt({ name: "AES-CBC", iv: ivBytes }, aesKey, ciphertextBytes)
				.then(cipherResolve)
				.catch((aargh) => {
					aargh = gr.addErrorOrigin("veldSleutelMapper - maak Promise", aargh);
					cipherReject(aargh);
				});
		})
			.then((plaintextBuffer) => {
				return zetVeldWaarde(plaintextBuffer, versleuteldVeld);
			})
			.then(() => {
				veldResolve();
			})
			.catch(function (err) {
				console.error(err);
				let error = new Error(err.message);
				const veldNaam = versleuteldVeld.getAttribute("data-name");
				error.message = `Ontsleutel catch bij veld ${veldNaam}. \n ${error.message}`;
				error = gr.addErrorOrigin("decrypt & in veldsleutelmapper", error);
				console.dir(error) && console.stack();
				veldReject(error);
			});
	});
}
/**
 * @returns Promise<Bool|Error>
 * @param {*} plaintextBuffer
 * @param {*} versleuteldVeld
 */
function zetVeldWaarde(plaintextBuffer, versleuteldVeld) {
	return new Promise((zetVeldResolve, zetVeldReject) => {
		try {
			const nweTekst = encGr.byteArrayToString(plaintextBuffer);
			versleuteldVeld.setAttribute("value", nweTekst);
			versleuteldVeld.value = nweTekst;

			if (!nweTekst.trim()) {
				versleuteldVeld.classList.add("geen-data");
			}

			if (
				versleuteldVeld.getAttribute("data-naam") === "ik_wil" ||
				versleuteldVeld.getAttribute("data-naam") === "aantekening"
			) {
				versleuteldVeld.textContent = nweTekst;
			}
			versleuteldVeld.classList.remove("verborgen");
			const leesVeld = gr.el(versleuteldVeld.id.replace("pers-", "lees-"));
			leesVeld.innerHTML = nweTekst;
			leesVeld.classList.remove("verborgen");
			zetVeldResolve(true);
		} catch (error) {
			zetVeldReject(gr.addErrorOrigin("zetVeldWaarde", error));
		}
	});
}

export function decryptieInit(){
	wachtwoordVeldNawerk();
	zetOntsleutelClick();
}


/**
 * helper van form.ontsleutel.
 * @returns Promise<string:wachtwoord|Error>
 */
 function sleutelInputPromise() {
	return new Promise((sleutelResolve, sleutelReject) => {
		const sleutelEl = gr.el("ontsleutel");
		if (!sleutelEl) {
			const e = new Error("Je vulde niets in.");
			sleutelReject(gr.addErrorOrigin(e, "ontsleutel sleutel veld lezen."));
			return;
		} else {
			DB().wachtwoord = sleutelEl.value;
			sleutelResolve(sleutelEl.value);
		}
	});
}
function	wachtwoordVeldNawerk () {
	const o = gr.el("ontsleutel");
	o.value = "";
	o.focus();
}
function zetOntsleutelClick () {
	// enter terwijl in invoerveld = klik button
	gr.el("ontsleutel").addEventListener("keyup", function (e) {
		if (e.key.toLowerCase() === "enter") {
			e.preventDefault();
			gr.el("ontsleutel-knop").click();
		}
	});

	gr.el("ontsleutel-knop")
	.addEventListener("click", (ontsleutelButtonEvent) => {
			ontsleutelButtonEvent.preventDefault();

			sleutelInputPromise()
				.then((sleutel) => {
					// oooover de velden heen.
					return maakSleutelEnOntsleutel(sleutel);
				})
				.then(() => {
					DB().ontsleuteld = true;
				})
				.catch((e) => {
					gr.communiceer(`fout in het ontsleutelen ${e.message}`);
					e.origin ? console.dir(e) && console.stack(e) : console.error(e);
				});
		});
}

// #endregion ontsleutelen

export function encryptieInit(){
	zetVerzendenInStukken ()
}

