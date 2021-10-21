// alles afkomstig van config paneel.

import {el} from "../gereedschap.js";

export default function initConfigPaneel() {
	zetBeeldSelectOnChange();
	alsInStorageGebruikBeeldStijl();
}

function zetBeeldSelectOnChange() {
	el("beeld-select").addEventListener("change", (e) => {
		const gekozenOptie = e.target.selectedOptions[0].value;
		localStorage.setItem("beeld-stijl", gekozenOptie);
		document
			.getElementById("grote-categorie-formulier")
			.setAttribute("data-form-stijl", gekozenOptie);
		document.getElementById("schakel-navigatie-config").click();
	});
}

function alsInStorageGebruikBeeldStijl() {
	const beeldStijl = localStorage.getItem("beeld-stijl");
	el("grote-categorie-formulier")
		.setAttribute("data-form-stijl", beeldStijl || "lijst");
}
