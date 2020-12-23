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

// function makeAJAXCall(url, methodType = "POST") {
// 	return new Promise((resolveAjax, rejectAjax) => {
// 		var xhr = new XMLHttpRequest();
// 		xhr.open(methodType, url, true);
// 		xhr.onreadystatechange = function () {
// 			// ready State 4 is verbinding is klaar.
// 			if (xhr.readyState === 4 && xhr.state === 200) {
// 				resolveAjax(xhr.response);
// 			}
// 			const klasseStaat = xhr.state.toString()[0];
// 			if (klasseStaat === "5" || klasseStaat === "4") {
// 				// 403, 502 etc
// 				rejectAjax(xhr);
// 			}
// 		};
// 		xhr.send();
// 	});
// }

function byteArrayToHexString(byteArray) {
	var hexString = "";
	var nextHexByte;
	for (var i = 0; i < byteArray.byteLength; i++) {
		nextHexByte = byteArray[i].toString(16); // Integer to base 16
		if (nextHexByte.length < 2) {
			nextHexByte = "0" + nextHexByte; // Otherwise 10 becomes just a instead of 0a
		}
		hexString += nextHexByte;
	}
	return hexString;
}

function hexStringToByteArray(hexString) {
	if (hexString.length % 2 !== 0) {
		throw "Must have an even number of hex digits to convert to bytes";
	}
	var numBytes = hexString.length / 2;
	var byteArray = new Uint8Array(numBytes);
	for (var i = 0; i < numBytes; i++) {
		byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
	}
	return byteArray;
}

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
