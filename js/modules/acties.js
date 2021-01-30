/**
 * @file de handelingen afkomstig vanuit het actie-paneel aan de rechterkant.
 */
import { formInvoerRijenArray } from "./gereedschap.js";
import PersoonRij from "./persoon-rij.js";

/**
 * initialisatie functie van alle acties die uit de navpanelen komen.
 */
export default function () {
	zetLijstKnoppenClicks();
}

function zetLijstKnoppenClicks() {
	const lijstMail = document.getElementById("lijst-mail-button");
	const lijstTelefoon = document.getElementById("lijst-telefoon-button");
	lijstMail.addEventListener("click", (e) => {
		lijstTelefoonOfMail("mail", e);
	});
	lijstTelefoon.addEventListener("click", (e) => {
		lijstTelefoonOfMail("telefoon", e);
	});
}

/**
 * PersoonRijen die zichtbaar zijn (bv ivm selectie)
 * @returns {array<PersoonRij>} array met persoonRijen
 */
function zichtbarePersRijen() {
	const persRijenArr = formInvoerRijenArray();
	return persRijenArr
		.map((rij) => {
			return new PersoonRij(rij);
		})
		.filter((P) => {
			return P.inSelectie();
		});
}

/**
 * mapt over rijen en haalt van getoonde rijen data op,
 * schrijft die naar de printer, stuurt clipboard aan.
 * creeert handige buttons om andere programma's mee te openen zoals mail/sms
 *
 * @param {string} lijstWat mail|telefoon
 * @param {event} event click event
 */
function lijstTelefoonOfMail(lijstWat, event = null) {
	event && event.preventDefault();
	const isMail = lijstWat === "mail";
	const printMetNamen = document.getElementById("lijst-ook-naam").checked;
	let printTekst = "";
	let linkHref = "";
	let ankerHTML = "";

	const persRijen = zichtbarePersRijen();

	// MAIL
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
      <span class='print-buttons-text'>Mail deze ${persRijen.length} adressen in 
      </span>
      <a class='print-button mail-cc' href='mailto:info@vloerwerk.org?cc=${a}'>CC</a>
      
      <a class='print-button mail-bc' href='mailto:info@vloerwerk.org?bcc=${a}'>BCC</a>      
		`;
	} else {
		// TELEFOON
		persRijen.forEach((P) => {
			printTekst += `${P.telefoon}, `;
			linkHref += `${P.telefoon}, `;
			const a = encodeURIComponent(linkHref);
			ankerHTML = `
      <span class='print-buttons-text'>Stuur:</span>
      <a class='print-button tel-sms' href='sms:${a}'>SMS (mobiel)</a>`;
		});
	}

	const printHTML = `
	  <span id='copyboard-succes'></span>
		<small>${printTekst.substring(0, printTekst.length - 2)}</small>
		<div class='printer-buttons'>
			${ankerHTML}
		</div>
	`;

	communiceer(printHTML);
	schrijfNaarClipboard(linkHref, !!event);
}

/**
 * helper van lijstTelefoonOfMail
 *
 * @param {string} tekst
 * @param {bool} isVanEvent
 */
function schrijfNaarClipboard(tekst, isVanEvent) {
	if (!isVanEvent) {
		document.getElementById(
			"copyboard-succes"
		).innerHTML = `Clipboard kon niet gebruikt worden omdat lijst niet door gebruiker zelf werd aangeroepen`;
	}
	navigator.clipboard
		.writeText(tekst)
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