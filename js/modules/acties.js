/**
 * @file de handelingen afkomstig vanuit het actie-paneel aan de rechterkant.
 */
import {NavElement} from "./navigatie-animatie.js";
import * as gr from "./gereedschap.js";
import maakRiseupScript from "./riseup-script.js";
import pakTekst from "./teksten.js";

/**
 * initialisatie functie van alle acties die uit de navpanelen komen.
 */
export default function () {
	zetLijstKnoppenClicks();
	zetRiseupCheckButtonClick();
	ZetClickVoegPersoonToe();
	zetUpdateLaatsGezienClick();
	zetVerwijderRijClick();
	wachtwoordVeldNawerk ();
	zetSluitPrinter();
	zetEscapeKlikVoorAlles();
}

/**
 * zet lijst buttons click handlers.
 */
function zetLijstKnoppenClicks() {
  gr.pakElementVeilig("lijst-mail-button")
	.addEventListener("click", (e) => {
		lijstTelefoonOfMail("mail", e);
	});
	gr.pakElementVeilig("lijst-telefoon-button")
	.addEventListener("click", (e) => {
		lijstTelefoonOfMail("telefoon", e);
	});
	
}

function zetRiseupCheckButtonClick(){
	gr.pakElementVeilig("riseup-check")
	.addEventListener("click", (e) => {
		e.preventDefault();
		riseupCheck(e);
	});	
}


/**
 * knalt emails in script dat valt te gebruiken in de console van riseup.
 */
function riseupCheck(e){
	const mailsVanLedenUitCRM = Array.from(document.querySelectorAll('.pers-input[type="email"]')).map(emailVeld => {
		return emailVeld.value.toLowerCase().trim()
	})
	const mailsVanLedenUitCRMJSON = JSON.stringify(mailsVanLedenUitCRM);
	const riseupScript = maakRiseupScript(mailsVanLedenUitCRMJSON);
	gr.communiceer(pakTekst('riseup'));
	schrijfNaarClipboard(riseupScript, !!e);
	setTimeout(()=>{
		window.open('https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500')
	}, 3000)
		
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
	const printMetNamen = gr.el("lijst-ook-naam").checked;
	let printTekst = "";
	let linkHref = "";
	let ankerHTML = "";

	const persRijen = gr.zichtbarePersRijen();

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
      <span class='print-buttons-text'>Mail deze ${persRijen.length} adressen in </span><a class='print-button mail-cc' href='mailto:info@vloerwerk.org?cc=${a}'>CC</a><a class='print-button mail-bc' href='mailto:info@vloerwerk.org?bcc=${a}'>BCC</a>      
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

	gr.communiceer(printHTML);
	gr.schrijfNaarClipboard(linkHref, !!event);
}


function ZetClickVoegPersoonToe() {
	//laatste rij kopieeren;
	//vind hoogst aanwezige ID en geef die aan nieuwe rij.
	gr.el("voeg-rij-toe").addEventListener("click", voegPersoonToe);
}

function voegPersoonToe(e) {
	e.preventDefault();
	gr.el("voeg-rij-toe").setAttribute("disabled", true);
	const formRijen = gr.formInvoerRijenArray();
	const nieuweId =
		Math.max(
			...formRijen.map((rij) => {
				const id = rij.querySelector(".pers-id").value;
				return Number(id) || 0;
			})
		) + 1;

	const bijnaZuivereHTML = formRijen[0].outerHTML
		.replace(/form\-rij\-\d+/, `form-rij-${nieuweId}`)
		.replace(/pers\-\d+\-(\w+)/g, `pers-${nieuweId}-$1`)
		.replace(/lees\-\d+\-(\w+)/g, `lees-${nieuweId}-$1`)
		.replace(/form\[\d+\]\[(\w+)\]/g, `form[${nieuweId}][$1]`);

	const legeHouderDiv = document.createElement("div");
	legeHouderDiv.innerHTML = bijnaZuivereHTML;
	
	legeHouderDiv.querySelectorAll("input").forEach((i) => (i.value = ""));
	legeHouderDiv.querySelectorAll("textarea").forEach((t) => {
		t.value = "";
		t.innerHTML = "";
	});
	legeHouderDiv.querySelectorAll(".pers-lees").forEach((p) => {
		p.innerHTML = "";
	});
	legeHouderDiv.querySelector(".pers-id").value = nieuweId;

	const clone = legeHouderDiv.querySelector(".form-rij");
	gr.el("form-rijen-lijst").appendChild(clone);

	// nav naar element.
	window.location.hash = clone.id;
	gr.el("voeg-rij-toe").removeAttribute("disabled");

	// datum update.
	schrijfVandaagNaarInput(gr.el(`pers-${nieuweId}-laatst_gezien`));
	gr.el(`pers-${nieuweId}-naam`).focus();
}

function zetUpdateLaatsGezienClick() {
	gr.el("form-rijen-lijst")
		.addEventListener("click", function (e) {
			if (e.target.classList.contains("update-laatst-gezien")) {
				e.preventDefault();
				schrijfVandaagNaarInput(e.target.parentNode.querySelector("input"))
			}
		});
	}
	
function schrijfVandaagNaarInput(input){
		var datumInstance = new Date();
		var vandaag =
		datumInstance.getDate() +
		"-" +
		(datumInstance.getMonth() + 1) +
		"-" +
		datumInstance.getFullYear();
		input.value = vandaag;
}

function zetVerwijderRijClick() {
	// //verwijder functionaliteit
	gr.el('grote-tabel-formulier').addEventListener('click', (e)=>{
		if (!e.target.classList.contains('rij-verwijderen')) {
			return 	
		}
		e.preventDefault();
		const gebruikerId = gr.el('.pers-id', e.target).value;
		const gebruikerNaam = gr.el(`lees-${gebruikerId}-naam`).textContent;

		if (confirm(`${gebruikerNaam} verwijderen?` )){
			const gebruikerRij = gr.el(`form-rij-${gebruikerId}`);
			gebruikerRij.parentNode.removeChild(gebruikerRij)
		}
					
	})

}

function	wachtwoordVeldNawerk () {
	const o = gr.el("ontsleutel");
	o.value = "";
	o.focus();
}

function zetSluitPrinter () {
	gr.el("sluit-printer")
	.addEventListener("click", function (e) {
		e.preventDefault();
		gr.el('.print-p').innerHTML = "";
		gr.el('printer').style.display = "none";
	});
}

function zetEscapeKlikVoorAlles() {
	document.addEventListener("keydown", (event) => {
		// verstopt navs
		if (event.key !== "Escape") return;
		Array.from(document.querySelectorAll(".crm-nav"))
			.map((nav) => new NavElement(nav))
			.forEach((navElement) => {
				navElement.sluit();
			});
		// printer / communiceer
		gr.el("printer").style.display = "none";
	});
}