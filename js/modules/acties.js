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
	let linkHref = "";
	let ankerHTML = "";
	const persRijenArr = formInvoerRijenArray();
	const persRijen = persRijenArr
		.map((rij) => {
			return new PersoonRij(rij);
		})
		.filter((P) => {
			return P.inSelectie();
		});
	if (isMail) {
		persRijen.forEach((P, index) => {
			if (printMetNamen) {
				printTekst += `${P.naam} &lt;${P.email}&gt;, `;
				linkHref += `${P.naam} <${P.email}>, `;
			} else {
				linkHref += `${P.email}, `;
				printTekst += `${P.email}, `;
			}
		});
		const a = encodeURIComponent(linkHref);
		ankerHTML = `
      <span class='print-buttons-text'>Mail deze ${persRijenArr.length} adressen in 
      </span>
      <a class='print-button mail-cc' href='mailto:info@vloerwerk.org?cc=${a}'>CC</a>
      
      <a class='print-button mail-bc' href='mailto:info@vloerwerk.org?bcc=${a}'>BCC</a>      
    `;
	} else {
		persRijen.forEach((P) => {
			printTekst += `${P.telefoon}, `;
			linkHref += `${P.telefoon}, `;
			const a = encodeURIComponent(linkHref);
			ankerHTML = `
      <span class='print-buttons-text'>Stuur:</span>
      <a class='print-button tel-sms' href='sms:${a}'>SMS (mobiel)</a>`;
		});
	}

	// laatste , enzo eraf, en tussen small.
	printTekst = `<small>${printTekst.substring(
		0,
		printTekst.length - 2
	)}</small>`;
	const printHTML = `
  <span id='copyboard-succes'></span>
  ${printTekst}
	<div class='printer-buttons'>

  ${ankerHTML}
  </div>
  `;

	communiceer(printHTML);
	navigator.clipboard
		.writeText(linkHref)
		.then(() => {
			document.getElementById(
				"copyboard-succes"
			).innerHTML = `Addressen naar clipboard gekopieerd (je hoeft niet te kopie&euml;ren)`;
		})
		.catch(() => {
			document.getElementById(
				"copyboard-succes"
			).innerHTML = `Clipboard werkt niet. Heb je toevallig een Apple 😶`;
		});
}
