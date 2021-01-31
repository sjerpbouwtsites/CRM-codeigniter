// alles afkomstig van config paneel.

export default function initConfigPaneel() {
	zetBeeldSelectOnChange();
	alsInStorageGebruikBeeldStijl();
}

function zetBeeldSelectOnChange() {
	document.getElementById("beeld-select").addEventListener("change", (e) => {
		const gekozenOptie = e.target.selectedOptions[0].value;
		localStorage.setItem("beeld-stijl", gekozenOptie);
		document
			.getElementById("grote-tabel-formulier")
			.setAttribute("data-form-stijl", gekozenOptie);
		document.getElementById("schakel-navigatie-config").click();
	});
}

function alsInStorageGebruikBeeldStijl() {
	const beeldStijl = localStorage.getItem("beeld-stijl");
	document
		.getElementById("grote-tabel-formulier")
		.setAttribute("data-form-stijl", beeldStijl || "lijst");
}
