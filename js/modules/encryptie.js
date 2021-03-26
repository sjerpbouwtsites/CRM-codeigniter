/** 'frontend' van enscryptie */

import * as encGr from "./encryptie-gereedschap.js";
import {communiceer,formInvoerVeldenArray} from "./gereedschap.js";

export function maakSleutelEnVersleutel(sleutelBasis) {
	return new Promise((resolveVersleutel, rejectVersleutel) => {
		communiceer("versleutelen begonnen");
		encGr.convertPassphraseToKey(sleutelBasis).then(function (key) {
			var iv = window.crypto.getRandomValues(new Uint8Array(16));
			printIV.value = encGr.byteArrayToBase64(iv);

			const veldEncryptiePromises = Array.from(
				document.querySelectorAll(".pers-input")
			).map((veld) => {
				return new Promise((resolveVeld, rejectVeld) => {
					var w = veld.value.trim();
					if (veld.getAttribute("naam") === "telefoon") {
						w = w.replace(/[^0-9]+|\s+/gim, "");
					}
					var encryptieRes = window.crypto.subtle.encrypt(
						{ name: "AES-CBC", iv: iv },
						key,
						encGr.stringToByteArray(w)
					);
					encryptieRes
						.then(function (ciphertextBuf) {
							var ciphertextBytes = new Uint8Array(ciphertextBuf);
							var base64Ciphertext = encGr.byteArrayToBase64(ciphertextBytes);
							veld.value = base64Ciphertext;
							veld.classList.add("verborgen");
							resolveVeld();
						})
						.catch(function (err) {
							const errMsg = `veld ${veld.getAttribute(
								"name"
							)} cijferen mislukt: ${err.message}\n`;
							communiceer("fuck!");
							err.message = `${errMsg}${err.message}`;
							rejectVeld(err);
						});
				});
			});

			Promise.all(veldEncryptiePromises)
				.then(() => {
					communiceer("versleutelen klaar", 1000);
					document.getElementById('grote-tabel-formulier').classList.add("versleuteld");
					resolveVersleutel(true);
				})
				.catch((err) => {
					throw err; // naar versleutel catch
				});
		});
	}).catch(function (error) {
		communiceer(encGr.verwerkFout(error, true));
		rejectVersleutel(error);
	});
}
/**
 * @returns Promise<Bool|Error>
 * @param {wachtwoord} sleutel
 */
export function maakSleutelEnOntsleutel(sleutel) {
	return new Promise((resolveOntsleutel, rejectOntsleutel) => {
		const ivBytes = encGr.base64ToByteArray(printIV.value.trim());

		encGr.convertPassphraseToKey(sleutel)
			.then(function (aesKey) {
				const veldDecryptiePromises = formInvoerVeldenArray().map(
					(versleuteldVeld) => {
						return perVeldSleutelMapper({ aesKey, versleuteldVeld, ivBytes });
					}
				);
				return Promise.all(veldDecryptiePromises);
			})
			.then(() => {
				communiceer("decryptie klaar", 1000);
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
					aargh = addErrorOrigin("veldSleutelMapper - maak Promise", aargh);
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
				error = addErrorOrigin("decrypt & in veldsleutelmapper", error);
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
			const leesVeld = document.getElementById(
				versleuteldVeld.id.replace("pers-", "lees-")
			);
			leesVeld.innerHTML = nweTekst;
			leesVeld.classList.remove("verborgen");
			zetVeldResolve(true);
		} catch (error) {
			zetVeldReject(addErrorOrigin("zetVeldWaarde", error));
		}
	});
}

export function decryptieInit(){
	zetOntsleutelClick();
}


/**
 * helper van form.ontsleutel.
 * @returns Promise<string:wachtwoord|Error>
 */
 function sleutelInputPromise() {
	return new Promise((sleutelResolve, sleutelReject) => {
		const sleutelEl = document.getElementById("ontsleutel");
		if (!sleutelEl) {
			const e = new Error("Je vulde niets in.");
			sessionStorage.setItem('wachtwoord', null);
			sleutelReject(addErrorOrigin(e, "ontsleutel sleutel veld lezen."));
			return;
		} else {
			sessionStorage.setItem('wachtwoord', sleutelEl.value)
			sleutelResolve(sleutelEl.value);
		}
	});
}

function zetOntsleutelClick () {
	// enter terwijl in invoerveld = klik button
	document
		.getElementById("ontsleutel")
		.addEventListener("keyup", function (e) {
			if (e.key.toLowerCase() === "enter") {
				e.preventDefault();
				$("button.ontsleutel").click();
			}
		});

	document
		.getElementById("ontsleutel-knop")
		.addEventListener("click", (ontsleutelButtonEvent) => {
			ontsleutelButtonEvent.preventDefault();

			sleutelInputPromise()
				.then((sleutel) => {
					// oooover de velden heen.
					return maakSleutelEnOntsleutel(sleutel);
				})
				.then(() => {
					document
						.getElementById("grote-tabel-formulier")
						.classList.add("ontsleuteld");
					document.getElementById("sleutelaars").classList.add("ontsleuteld");
					sessionStorage.setItem('ontsleuteld', 'true');
					
				})

				.then(() => {})
				.catch((e) => {
					communiceer(`fout in het ontsleutelen ${e.message}`);
					e.origin ? console.dir(e) && console.stack(e) : console.error(e);
				});
		});
}

export function encryptieInit(){
	zetVerzendenInStukken ()
}

function zetVerzendenInStukken () {
	const groteFormulier = document.getElementById("grote-tabel-formulier");
	const groteFormulierVerzendKnop = document.getElementById(
		"verzend-grote-formulier-knop"
	);
	groteFormulierVerzendKnop.addEventListener(
		"click",
		verzendInStukkenCallback
	);
	groteFormulier.addEventListener("submit", verzendInStukkenCallback);
}


function verzendInStukkenCallback(e) {
	e.preventDefault();
	//button disablen
	document
		.getElementById("verzend-grote-formulier-knop")
		.setAttribute("disabled", true);
	// eerst versleutelen
	if (!sessionStorage.getItem('wachtwoord')) throw new Error("wachtwoord vergeten door app");
	const versleutelMet = sessionStorage.getItem('wachtwoord');
	maakSleutelEnVersleutel(versleutelMet)
		.then(() => {
			document
				.getElementsByTagName("body")[0]
				.classList.add("voorbereid-op-afsluiten");
			communiceer("Versleuteld. Nu comprimeren en versturen.", 1000);
			const groteFormulier = document.getElementById("grote-tabel-formulier");
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
					url: document.getElementById("grote-tabel-formulier").action,
					method: "post",
					data: SQLVriendelijkePostData,
				})
				.then((antwoord) => {
					// afsluiten
					communiceer(
						`Gelukt! Server zegt: ${antwoord.data}. Dit programma sluit nu af.`,
						2000
					);
					document.getElementsByTagName("body")[0].classList.add("afsluiten");
				})
				.catch((e) => {
					console.log(e);
					document
						.getElementsByTagName("body")[0]
						.classList.remove("voorbereid-op-afsluiten");

					try {
						communiceer(
							`En dat is een fout!
						De server zegt: ${e}`,
							5000
						);
					} catch (error) {
						alert(
							"er ging iets fout, ergens, en bij het lezen van de fout ging iets fout, of de fout is niet begrepen."
						);
						throw error;
					}
				});
		}) // then van maakSleutelEnVersleutel
		.catch((e) => {
			communiceer(`fout in de versleuteling ${e}`, 1000);
			throw e;
		});
}
