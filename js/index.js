import * as encryptie from "./encryptie.js";
import navigatie from "./navigatie.js";
import form from "./form.js";

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

function sluitPrinterHandler() {
	var p = document.getElementById("printer");
	var s = document.getElementById("sluit-printer");
	s.addEventListener("click", function (e) {
		e.preventDefault();
		p.getElementsByTagName("p")[0].innerHTML = "";
		$("#printer").hide(200);
	});
}

function wachtwoordVeldNawerk() {
	const o = document.getElementById("ontsleutel");
	o.value = "";
	o.focus();
}

function willekeurigeGradientHoekrijen() {
	document.querySelectorAll(".form-rij + .form-rij").forEach((rij) => {
		const hoek = Math.floor(Math.random() * 360);
		rij.style.background = `linear-gradient(${hoek}deg, rgba(213, 189, 180, 0.44), rgba(180, 147, 147, 0.47))`;
	});
}

function init() {
	sluitPrinterHandler();
	wachtwoordVeldNawerk();
	willekeurigeGradientHoekrijen();
	encryptie.zetClickKeyupOntsleutel();
	navigatie.animatie();
	navigatie.acties.zet();
	form.acties.zet();
	encryptie.localhostDevhulp();
	gereedschap.communiceer("CRM geinitialiseerd");
	localStorage.setItem("vw-crm-eerder-bezocht", "ja");
}
init();
