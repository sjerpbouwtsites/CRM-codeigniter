
export function byteArrayToBase64 (byteArray) {
		var binaryString = "";
		for (var i = 0; i < byteArray.byteLength; i++) {
			binaryString += String.fromCharCode(byteArray[i]);
		}
		var base64String = window.btoa(binaryString);
		return base64String;
	}


export function base64ToByteArray(base64String) {
	try {
		var binaryString = window.atob(base64String);
		var byteArray = new Uint8Array(binaryString.length);
		for (var i = 0; i < binaryString.length; i++) {
			byteArray[i] += binaryString.charCodeAt(i);
		}
	} catch (error) {
		return error;
	}

	return byteArray;
}


export  function byteArrayToString(byteArray) {
		if ("TextDecoder" in window) {
			const decoder = new window.TextDecoder();
			return decoder.decode(byteArray);
		}

		// Otherwise, fall back to 7-bit ASCII only
		var result = "";
		for (var i = 0; i < byteArray.byteLength; i++) {
			result += String.fromCharCode(byteArray[i]);
		}
		return result;
	}


export function stringToByteArray (s) {
		if ("TextEncoder" in window) {
			const encoder = new window.TextEncoder();
			return encoder.encode(s);
		}

		// Otherwise, fall back to 7-bit ASCII only
		var result = new Uint8Array(s.length);
		for (var i = 0; i < s.length; i++) {
			result[i] = s.charCodeAt(i);
		}
		return result;
	}


/**
 * Creeert de basis data tbv van de crypto.
 * @returns Promise<CryptoKey>
 * @param {*} wachtwoordString
 */
export function convertPassphraseToKey(wachtwoordString) {
	// het zijn hieronder twee promises dus hier ook promise
	// voor consistente foutafhandeling.
	const cryptoBasis = new Promise((resolve, reject) => {
		try {
			const revoluties = 1000000; // meer is beter
			const zoutStreng =
				"You need to know the salt later to decrypt. It's not a secret, though.";
			const zoutBytes = stringToByteArray(zoutStreng);
			const wachtwoordBytes = stringToByteArray(wachtwoordString);
			resolve({ zoutBytes, wachtwoordBytes, revoluties });
		} catch (error) {
			reject(error);
		}
	});
	return cryptoBasis.then(importKeyAsync);
}

/**
 *
 * @returns Promise<CryptoKey>
 * @param {*} cryptoBasisRes {revoluties, zoutStreng, passphrasBytes}
 */
export function importKeyAsync(cryptoBasisRes) {
	return new Promise((importKeyAsyncResolve, importKeyAsyncReject) => {
		window.crypto.subtle
			.importKey(
				"raw",
				cryptoBasisRes.wachtwoordBytes,
				{ name: "PBKDF2" },
				false,
				["deriveKey"]
			)
			.then((baseKey) => {
				return new Promise((deriveResolve, deriveReject) => {
					window.crypto.subtle
						.deriveKey(
							{
								name: "PBKDF2",
								salt: cryptoBasisRes.zoutBytes,
								iterations: cryptoBasisRes.revoluties,
								hash: "SHA-1",
							},
							baseKey,
							{ name: "AES-CBC", length: 256 },
							false,
							["encrypt", "decrypt"]
						)
						.then((diriveRes) => {
							deriveResolve(diriveRes);
						})
						.catch((deriveErr) => {
							deriveReject(deriveErr);
						});
				});
			})
			.then((dirivedKeyRes) => {
				importKeyAsyncResolve(dirivedKeyRes);
			})
			.catch((deriveKeyOrImportKeyError) => {
				importKeyAsyncReject(deriveKeyOrImportKeyError);
			});
	});
}