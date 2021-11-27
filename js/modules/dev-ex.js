import * as gr from "./gereedschap.js"

export default function () {
	autoDecrypt()
	fixLocalhost();
}

function fixLocalhost() {
	document.querySelectorAll("a[href*=localhost]").forEach(anker => {
		const oudeLink = anker.href;
		anker.setAttribute('href', oudeLink.replace('/crm/', '/crm/index.php/'));
	})
	document.querySelectorAll("form[data-action*=localhost]").forEach(form => {
		const oudeLink = form.getAttribute('data-action');
		form.setAttribute('data-action', oudeLink.replace('/crm/', '/crm/index.php/'));
	})
}

function autoDecrypt() {

	const isDev = location.href.includes("localhost");
	const wilHerladen = location.hash.includes('herladen-met-wachtwoord');

	if (!isDev || !wilHerladen) return;
	try {
		const opgeslagenWW = localStorage.getItem("herladen-met-wachtwoord");
		if (!opgeslagenWW) {
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
		}
	} catch (err) {
		gr.communiceer("Iets gaat mis bij auto-decrypt.");
		console.error(err);
	}
	gr.communiceer("auto-decrypt", 200);
}



