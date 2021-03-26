import * as gr from "./gereedschap.js"

export default function (){
  alsOpLocalHostOnthoudDecrypieEnVoerIn ()
}

function alsOpLocalHostOnthoudDecrypieEnVoerIn () {
	if (!location.href.includes("localhost")) return;
	try {
		const opgeslagenWW = sessionStorage.getItem("crm-decryptie");
		if (!opgeslagenWW) {
			gr.el("ontsleutel").addEventListener("change", function () {
				sessionStorage.setItem(
					"crm-decryptie",
					gr.el("ontsleutel").value
				);
			});
			return;
		} else {
			gr.el("ontsleutel").value = opgeslagenWW;
			gr.el("ontsleutel-knop").click();
		}
	} catch (err) {
		gr.communiceer("Iets gaat mis bij auto-decrypt.");
		console.error(err);
	}
	gr.communiceer("auto-decrypt", 200);
}

