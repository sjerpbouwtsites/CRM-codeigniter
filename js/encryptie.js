/* eslint-disable */
function convertPassphraseToKey(passphraseString) {
	var iterations = 1000000; // Longer is slower... hence stronger
	var saltString =
		"You need to know the salt later to decrypt. It's not a secret, though.";
	var saltBytes = stringToByteArray(saltString);
	var passphraseBytes = stringToByteArray(passphraseString);

	return window.crypto.subtle
		.importKey("raw", passphraseBytes, { name: "PBKDF2" }, false, ["deriveKey"])
		.then(function (baseKey) {
			return window.crypto.subtle.deriveKey(
				{
					name: "PBKDF2",
					salt: saltBytes,
					iterations: iterations,
					hash: "SHA-1",
				},
				baseKey,
				{ name: "AES-CBC", length: 256 },
				false,
				["encrypt", "decrypt"]
			);
		})
		.catch(function (err) {
			alert(
				"Could not generate a key from passphrase '" +
					passphrase +
					"': " +
					err.message
			);
		});
}

function maakSleutelEnVersleutel(sleutelBasis) {
	return new Promise((resolveVersleutel, rejectVersleutel) => {
		communiceer("versleutelen begonnen");
		convertPassphraseToKey(sleutelBasis)
			.then(function (key) {
				var iv = window.crypto.getRandomValues(new Uint8Array(16));
				printIV.value = byteArrayToBase64(iv);
				var $formPers = $("form [class|='pers']");
				$formPers.each(function (i, veld) {
					var type = veld.getAttribute("data-naam");

					if (type === "id") {
						return;
					}

					// wat is dit voor shit
					var ditIsDeLaatste = !($formPers.length - 1 - i);

					var w = veld.value.trim();
					if (type === "telefoon") {
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

							if (ditIsDeLaatste) {
								communiceer("versleutelen klaar", 1000);
								$("form").addClass("versleuteld");
								resolveVersleutel(true);
							}
						})
						.catch(function (err) {
							communiceer(err.message);
							rejectVersleutel(err);
						});

					veld.setAttribute("oude-type", veld.getAttribute("type"));
					veld.setAttribute("type", "text");

					if (veld.hasAttribute("required")) {
						veld.removeAttribute("required");
						veld.setAttribute("oud-required", "true");
					}
				});
			})
			.catch(function (err) {
				communiceer("versleutelen mislukt: " + err.message);
				rejectVersleutel(err);
			});
	});
}

function maakSleutelEnOntsleutel(sleutel) {
	return new Promise((resolveOntsleutel, rejectOntsleutel) => {
		var ivBytes = base64ToByteArray(printIV.value.trim());
		communiceer("decryptiesleutel wordt gemaakt");
		convertPassphraseToKey(sleutel)
			.then(function (aesKey) {
				communiceer("decryptie begint");

				const veldDecryptiePromises = Array.from(
					document.querySelectorAll(".pers-input")
				).map((versleuteldVeld) => {
					return new Promise((veldResolve, veldReject) => {
						if (!versleuteldVeld.value.length) {
							veldResolve();
						}
						var ciphertextBytes = base64ToByteArray(versleuteldVeld.value);
						window.crypto.subtle
							.decrypt(
								{ name: "AES-CBC", iv: ivBytes },
								aesKey,
								ciphertextBytes
							)
							.then(function (plaintextBuffer) {
								var nweTekst = byteArrayToString(plaintextBuffer);
								versleuteldVeld.setAttribute("value", nweTekst);
								versleuteldVeld.value = nweTekst;
								if (
									versleuteldVeld.getAttribute("data-naam") === "ik_wil" ||
									versleuteldVeld.getAttribute("data-naam") === "aantekening"
								) {
									versleuteldVeld.textContent = nweTekst;
								}
								veldResolve();
							})
							.catch(function (err) {
								const errMsg = `veld ${versleuteldVeld.getAttribute(
									"name"
								)}ontcijferen mislukt: ${err.message}\n`;
								communiceer("fuck!");
								err.message = `${errMsg}${err.message}`;
								veldReject(err);
							});
					});
				});

				Promise.all(veldDecryptiePromises)
					.then(() => {
						communiceer("decryptie klaar", 1000);
						resolveOntsleutel(true);
					})
					.catch((error) => {
						throw error; // naar ontsleutel eigen reject
					});
			})
			.catch(function (error) {
				communiceer(verwerkFout(error, true));
				rejectOntsleutel(error);
			});
	});
}
