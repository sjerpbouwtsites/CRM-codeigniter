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

function byteArrayToBase64(byteArray) {
	var binaryString = "";
	for (var i = 0; i < byteArray.byteLength; i++) {
		binaryString += String.fromCharCode(byteArray[i]);
	}
	var base64String = window.btoa(binaryString);
	return base64String;
}

function base64ToByteArray(base64String) {
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

function byteArrayToString(byteArray) {
	if ("TextDecoder" in window) {
		decoder = new window.TextDecoder();
		return decoder.decode(byteArray);
	}

	// Otherwise, fall back to 7-bit ASCII only
	var result = "";
	for (var i = 0; i < byteArray.byteLength; i++) {
		result += String.fromCharCode(byteArray[i]);
	}
	return result;
}

function stringToByteArray(s) {
	if ("TextEncoder" in window) {
		encoder = new window.TextEncoder();
		return encoder.encode(s);
	}

	// Otherwise, fall back to 7-bit ASCII only
	var result = new Uint8Array(s.length);
	for (var i = 0; i < s.length; i++) {
		result[i] = s.charCodeAt(i);
	}
	return result;
}

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

/**
 * @returns Array<NodeList> lijst van alle invoervelden in crm form.
 * @throws
 */
function formInvoerVeldenArray() {
	try {
		return Array.from(document.querySelectorAll(".pers-input"));
	} catch (error) {
		console.error("gezocht naar .pers-input maar niets te vinden!");
		throw error;
	}
}

/**
 * maakt origin key/string; zet nieuwe waarde.
 * @param {string} origin
 * @param {Error} error
 */
function addErrorOrigin(origin, error) {
	if (!origin || !error) {
		throw new Error("add Error Origin faal");
	}
	if (!error.origin) error.origin = "";
	error.origin = `${origin}\n${error.origin}`;
	return error;
}
