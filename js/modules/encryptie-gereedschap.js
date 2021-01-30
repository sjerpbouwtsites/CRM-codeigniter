import { ESMMigratieGlobalCheck } from "./gereedschap.js";

export var byteArrayToBase64 = ESMMigratieGlobalCheck(
	"byteArrayToBase64",
	function (byteArray) {
		var binaryString = "";
		for (var i = 0; i < byteArray.byteLength; i++) {
			binaryString += String.fromCharCode(byteArray[i]);
		}
		var base64String = window.btoa(binaryString);
		return base64String;
	}
);

export var base64ToByteArray = ESMMigratieGlobalCheck(
	"base64ToByteArray",
	function (base64String) {
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
);

export var byteArrayToString = ESMMigratieGlobalCheck(
	"byteArrayToString",
	function (byteArray) {
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
);

export var stringToByteArray = ESMMigratieGlobalCheck(
	"stringToByteArray",
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
);
