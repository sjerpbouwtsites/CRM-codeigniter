import PersoonRij from "./persoon-rij.js";
import { vindInOuders } from "./gereedschap.js";

export default function formulierInit() {
	zetBewerkModusClick();
}

function zetBewerkModusClick() {
	// zoek voor clicks op of in form-rij
	document.getElementById("form-rijen-lijst").addEventListener("click", (e) => {
		const formRij = vindInOuders(
			e.target,
			(element) => {
				return element.classList.contains("form-rij");
			},
			5
		);
		const bewerkend = document.querySelector(".bewerk-modus");
		if (bewerkend && bewerkend.id !== formRij.id) {
			bewerkend.classList.remove("bewerk-modus");
			(() => {
				new PersoonRij(bewerkend).schrijfDataNaarLeesVelden();
			})();
		}
		if (!formRij) {
			return;
		}

		!formRij.classList.contains("bewerk-modus") &&
			formRij.classList.add("bewerk-modus");
	});
}
