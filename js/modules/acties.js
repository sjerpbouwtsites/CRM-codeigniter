/**
 * @file de handelingen afkomstig vanuit het actie-paneel aan de rechterkant.
 */
import { formInvoerRijenArray } from "./gereedschap.js";
import PersoonRij from "./persoon-rij.js";
import {NavElement} from "./navigatie-animatie.js";
import * as gr from "./gereedschap.js";

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
	
	const riseupScript = `

		const mailsVanLedenUitCRM = ${mailsVanLedenUitCRMJSON};
		
		function VWRequirementsMet(){
			return location.href.includes('lists.riseup.net') && location.search.includes('size=500')
		}
		
		function makeRiseupInsertHTML(welInCRMNietInRiseup){
			const lis = (welInCRMNietInRiseup.map(missendLid =>{
					return "<li>"+missendLid+"</li>";
			}).join(''));
			return "<div id='missende-leden' style='background-color: rgb(228, 133, 133); padding: 20px'><h2>De volgende mensen zitten wel in het CRM maar niet in Riseup.</h2><ol>"+lis+"</ol></div>";
			}

		function runVWFilters(){
			const riseupMailAdressen = Array.from(document.querySelectorAll('a[href*="@"][href^="/www/editsubscriber"]'));
		
			// check welke mails wel in riseup zitten, maar niet in het CRM.
			riseupMailAdressen.forEach(riseupAnker => {
				const mailAdres = riseupAnker.textContent;
				if (mailsVanLedenUitCRM.includes(mailAdres)) {
					riseupAnker.parentNode.parentNode.style = "background-color: #85e485;"
					riseupAnker.parentNode.parentNode.title = "Ik zit in het CRM èn in Riseup"
				} else {
					riseupAnker.parentNode.parentNode.style = "background-color: #85b3e4;"
					riseupAnker.parentNode.parentNode.title = "Ik zit wel in Riseup, maar niet in de CRM ledentabel."    
				}
			})
			
			const riseupMailAdressenTekst = riseupMailAdressen.map(adres => adres.textContent)
			
			const welInCRMNietInRiseup = mailsVanLedenUitCRM.filter(lidUitCRM =>{
				return !riseupMailAdressenTekst.includes(lidUitCRM);
			})
		
			if (welInCRMNietInRiseup.length) {
				const insertHTML = makeRiseupInsertHTML(welInCRMNietInRiseup);
		
				// damn dirty
				document.querySelector('.search_form').innerHTML = insertHTML;
				location.hash = 'missende-leden';
			}
			
			alert('muis over de mailregistraties om de tooltip te lezen.')
		}
		
		function VWinitRiseupScript (){
			if (!VWRequirementsMet()) {
				alert('je bent niet op de goede pagina gek')
				location.href = "https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500"
			}
			runVWFilters()
		}
		
		VWinitRiseupScript()`;

		gr.communiceer(`Er is zojuist een script naar je klikbord gekopie&euml;rd. Er wordt over 3 seconden een tabblad geopend met de pagina van riseup waar je dient te zijn: Vloerwerk ledenlijst, 500 resultaten per pagina. <a target='_blank' href='https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500#missende-leden'>Zo niet klik dan hier</a><br><br><strong>☣☣☣</strong><br>Nu ga je dit script uitvoeren op die pagina. Klik op die pagina op <kbd>f12</kbd>, klik op het tabblad console in de developer tools en druk daar op <kbd>control c</kbd> en dan <kbd>enter</kbd>.<br><br><span id='copyboard-succes'></span>`);
		schrijfNaarClipboard(riseupScript, !!e);
		setTimeout(()=>{
			window.open('https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500')
		}, 3000)
		
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

	gr.communiceer(printHTML);
	schrijfNaarClipboard(linkHref, !!event);
}

/**
 * helper van lijstTelefoonOfMail & riseupcheck
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
			).innerHTML = `Addressen of script naar clipboard gekopieerd (je hoeft niet te kopie&euml;ren)`;
		})
		.catch(() => {
			document.getElementById(
				"copyboard-succes"
			).innerHTML = `Clipboard werkt niet. Heb je toevallig een Apple 😶`;
		});
}

function ZetClickVoegPersoonToe() {
	//laatste rij kopieeren;
	//vind hoogst aanwezige ID en geef die aan nieuwe rij.
	document
		.getElementById("voeg-rij-toe")
		.addEventListener("click", voegPersoonToe);
}

function voegPersoonToe(e) {
	e.preventDefault();
	document.getElementById("voeg-rij-toe").setAttribute("disabled", true);

	const formRijen = formInvoerRijenArray();

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

	console.log(legeHouderDiv);
	const clone = legeHouderDiv.querySelector(".form-rij");
	document.getElementById("form-rijen-lijst").appendChild(clone);

	// nav naar element.
	window.location.hash = clone.id;
	document.getElementById("voeg-rij-toe").removeAttribute("disabled");

	// datum update.
	document.querySelector(`#form-rij-${nieuweId} .update-laatst-gezien`).click();

	document.getElementById(`pers-${nieuweId}-naam`).focus();
}

function zetUpdateLaatsGezienClick() {
	document
		.getElementById("form-rijen-lijst")
		.addEventListener("click", function (e) {
			if (e.target.classList.contains("update-laatst-gezien")) {
				e.preventDefault();
				var datumInstance = new Date();
				var vandaag =
					datumInstance.getDate() +
					"-" +
					(datumInstance.getMonth() + 1) +
					"-" +
					datumInstance.getFullYear();
				e.target.parentNode.querySelector("input").value = vandaag;
			}
		});
}

function zetVerwijderRijClick() {
	// //verwijder functionaliteit
	document.getElementById('grote-tabel-formulier').addEventListener('click', (e)=>{
		if (!e.target.classList.contains('rij-verwijderen')) {
			return 	
		}
		e.preventDefault();
		const gebruikerId = e.target.querySelector('.pers-id').value;
		const gebruikerNaam = document.getElementById(`lees-${gebruikerId}-naam`).textContent;

		if (confirm(`${gebruikerNaam} verwijderen?` )){
			const gebruikerRij = document.getElementById(`form-rij-${gebruikerId}`);
			gebruikerRij.parentNode.removeChild(gebruikerRij)
		}
					
	})

}

function	wachtwoordVeldNawerk () {
	const o = document.getElementById("ontsleutel");
	o.value = "";
	o.focus();
}

function 	zetSluitPrinter () {
	var p = document.getElementById("printer");
	var s = document.getElementById("sluit-printer");
	s.addEventListener("click", function (e) {
		e.preventDefault();
		p.getElementsByTagName("p")[0].innerHTML = "";
		document.querySelector('#printer').style.display = "none";
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
		document.getElementById("printer").style.display = "none";
	});
}