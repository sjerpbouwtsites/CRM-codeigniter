import * as gr from "./gereedschap.js"

export default function (){
	console.log("NEEEE")
  autoDecrypt()
}

/** was eerst alleen voor dev, nu ook na opslaan. */
function autoDecrypt() {

	const isDev = location.href.includes("localhost");
	const wilHerladen = location.hash !== '#herladen-met-wachtwoord';

	if (!isDev && !wilHerladen) return;
	console.log("JAAA'");
	try {
		const opgeslagenWW = localStorage.getItem("herladen-met-wachtwoord");
		console.log("JAAA'");
		if (!opgeslagenWW) {
			console.log("JAAA'");
			gr.el("ontsleutel").addEventListener("change", function () {
				localStorage.setItem(
					"herladen-met-wachtwoord",
					gr.el("ontsleutel").value
				);
			});
			return;
		} else {
			gr.el("ontsleutel").value = opgeslagenWW;
			gr.el("ontsleutel-knop").click();
			console.log("JAfdsfdsfdsAA'");
		}
	} catch (err) {
		gr.communiceer("Iets gaat mis bij auto-decrypt.");
		console.error(err);
	}
	gr.communiceer("auto-decrypt", 200);
}



