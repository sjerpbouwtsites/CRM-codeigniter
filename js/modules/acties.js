/**
 * @file de handelingen afkomstig vanuit het actie-paneel aan de rechterkant.
 */
import { PersoonRij, formInvoerRijenArray } from "./gereedschap.js";

export default function () {
	zetLijstKnopClicks();
}

function zetLijstKnopClicks() {
	const lijstMail = document.getElementById("lijst-mail-button");
	const lijstTelefoon = document.getElementById("lijst-telefoon-button");
	lijstMail.addEventListener("click", (e) => {
		lijstTelefoonOfMail("mail", e);
	});
	lijstTelefoon.addEventListener("click", (e) => {
		lijstTelefoonOfMail("telefoon", e);
	});
}

function lijstTelefoonOfMail(lijstWat, event) {
	event.preventDefault();
	const isMail = lijstWat === "mail";
	const printMetNamen = document.getElementById("lijst-ook-naam").checked;

	let printTekst = "";
	if (isMail) {
		formInvoerRijenArray().forEach((rij, index) => {
			const P = new PersoonRij(rij);
			if (printMetNamen) {
				printTekst += `${P.naam} &lt;${P.email}&gt;, `;
			} else {
				printTekst += `${P.email}, `;
			}
		});
	} else {
		formInvoerRijenArray().forEach((rij) => {
			const P = new PersoonRij(rij);
			printTekst += `${P.telefoon}, `;
		});
	}

	// laatste , enzo eraf;
	printTekst = printTekst.substring(0, printTekst.length - 2);

	communiceer(printTekst);
}
