import {communiceer} from "./gereedschap.js"

export default function (){
  alsOpLocalHostOnthoudDecrypieEnVoerIn ()
}

function alsOpLocalHostOnthoudDecrypieEnVoerIn () {
	if (!location.href.includes("localhost")) return;
	try {
		const opgeslagenWW = localStorage.getItem("crm-decryptie");
		if (!opgeslagenWW) {
			document
				.getElementById("ontsleutel")
				.addEventListener("change", function () {
					localStorage.setItem(
						"crm-decryptie",
						document.getElementById("ontsleutel").value
					);
				});
			return;
		} else {
			document.getElementById("ontsleutel").value = opgeslagenWW;
			document.getElementById("ontsleutel-knop").click();
		}
	} catch (err) {
		communiceer("Iets gaat mis bij auto-decrypt.");
		console.error(err);
	}
	communiceer("auto-decrypt", 200);
}

