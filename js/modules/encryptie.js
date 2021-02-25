/** 'frontend' van enscryptie */

import  * as encryptieGereedschap from "./encryptie-gereedschap.js";


export function maakSleutelEnVersleutel(sleutelBasis) {
	return new Promise((resolveVersleutel, rejectVersleutel) => {
		communiceer("versleutelen begonnen");
		encryptieGereedschap.convertPassphraseToKey(sleutelBasis).then(function (key) {
			var iv = window.crypto.getRandomValues(new Uint8Array(16));
			printIV.value = byteArrayToBase64(iv);

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
						stringToByteArray(w)
					);
					encryptieRes
						.then(function (ciphertextBuf) {
							var ciphertextBytes = new Uint8Array(ciphertextBuf);
							var base64Ciphertext = byteArrayToBase64(ciphertextBytes);
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
					$("form").addClass("versleuteld");
					resolveVersleutel(true);
				})
				.catch((err) => {
					throw err; // naar versleutel catch
				});
		});
	}).catch(function (error) {
		communiceer(verwerkFout(error, true));
		rejectVersleutel(error);
	});
}
/**
 * @returns Promise<Bool|Error>
 * @param {wachtwoord} sleutel
 */
export function maakSleutelEnOntsleutel(sleutel) {
	return new Promise((resolveOntsleutel, rejectOntsleutel) => {
		const ivBytes = base64ToByteArray(printIV.value.trim());

		encryptieGereedschap.convertPassphraseToKey(sleutel)
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

			ciphertextBytes = base64ToByteArray(versleuteldVeld.value);
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
			const nweTekst = byteArrayToString(plaintextBuffer);
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
