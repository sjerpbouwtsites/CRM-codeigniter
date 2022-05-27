import maakRiseupScript from "./riseup-script.js";
import pakTekst from "../teksten.js";
import * as gr from "../gereedschap.js";
import { NavElement } from "../navigatie-animatie.js";
import DB from "../database.js";
import PersoonRij from "../persoon-rij.js";
import { opslaan } from "../encryptie.js";

export default function () {
	zetLijstKnoppenClicks();
	zetRiseupCheckButtonClick();
	ZetClickVoegPersoonToe();
	zetLuisterRegistratieViaJSONChange();
	zetClickOpenMultiBewerk();
	zetAlsMultiBewerkVeranderd();
	zetClickBeeindigMultiBewerker();
	zetWachtwoordVeranderen();
}

function zetWachtwoordVeranderen() {
	gr.el("wachtwoord-veranderen").addEventListener("click", veranderWachtwoord);
}

function veranderWachtwoord(e) {
	e.preventDefault();
	if (!confirm("Weet je zeker dat je het wachtwoord wilt veranderen?")) return;
	var oudWachtwoord = DB().wachtwoord;
	var nieuwWachtwoord = prompt("Verander wachtwoord naar");
	DB().wachtwoord = nieuwWachtwoord;
	gr.communiceer(
		"Over 10 seconden worden nieuwe tabbladen geopend. In de andere categorieen moet het wachtwoord ook gewijzigd worden, maar die moeten eerst nog ontsleutel worden met het oude wachtwoord. Ontsleutel het met het oude wachtwoord. Ze slaan vanzelf op. Dit scherm wordt opgeslagen"
	);
	setTimeout(() => {
		const huidigeCategorie = document.querySelector(
			'[name="form_meta[categorie_naam]"'
		).value;
		const huidigeUser = document.querySelector('[name="form_meta[user]"').value;
		let baseUrl = document.body.getAttribute("data-base-url");
		if (baseUrl.includes("localhost")) {
			//			baseUrl = baseUrl + "index.php";
		}
		["bondgenoten", "contacten", "leden"].forEach((categorieNaam) => {
			if (categorieNaam !== huidigeCategorie) {
				let url = new URL(`${baseUrl}categorie/${categorieNaam}/${huidigeUser}`, baseUrl);
				url.searchParams.set("vernieuwWachtwoord", nieuwWachtwoord);
				console.log(url);
				window.open(url);
			}
		});
		opslaan();
	}, 10000);
}

function zetClickOpenMultiBewerk() {
	gr.el("schakel-multi-bewerk").addEventListener("click", toggleMultiBewerk);
}

function zetAlsMultiBewerkVeranderd() {
	DB().alsVeranderdDoe("multiBewerk", (nieuweStaat, oudeStaat) => {
		// zet tekst in button
		const multiBewerkKnop = gr.el("schakel-multi-bewerk");
		const appBody = gr.el("app-body");
		if (nieuweStaat === true) {
			multiBewerkKnop.innerHTML = "Stop multi bewerking";
			multiBewerkKnop.setAttribute("data-ingeschakeld", true);
			appBody.setAttribute("data-multi-bewerking", true);
		} else {
			multiBewerkKnop.innerHTML = "Hele selectie bewerken";
			multiBewerkKnop.removeAttribute("data-ingeschakeld");
			appBody.removeAttribute("data-multi-bewerking");
			const oudeMultiRijBuiten = gr.el("multi-rij-buiten");
			oudeMultiRijBuiten.parentNode.removeChild(oudeMultiRijBuiten);
			return;
		}

		const rijenInBewerking = gr.zichtbarePersRijen();
		if (!rijenInBewerking.length) {
			gr.communiceer("Geen rijen gevonden om te bewerken?");
			return;
		}

		const rijenLijst = gr.el("form-rijen-lijst");

		const basisBewerkingRij = maakLegePersoonRij("multi-rij");
		const multiBewerkSchil = document.createElement("div");
		multiBewerkSchil.id = "multi-rij-buiten";
		multiBewerkSchil.className = "multi-rij-buiten";
		multiBewerkSchil.innerHTML = basisBewerkingRij;
		rijenLijst.appendChild(multiBewerkSchil);
		const multiRij = gr.el("form-rij-multi-rij");
		multiRij.classList.add("multi-rij", "bewerk-modus");

		// verwijderen uit multi rij
		const ongewensteElementen = [
			".rij-verwijderen",
			".cel-naam",
			".cel-email",
			".cel-telefoon",
			".cel-laatst_gezien",
			".cel-aantekening",
		];
		ongewensteElementen.forEach((ongewenst) => {
			const o = gr.el(ongewenst, multiRij);
			o.parentNode.removeChild(o);
		});

		const beeindigBewerken = gr.el(".beeindig-bewerken-cel", multiRij);
		beeindigBewerken.classList.remove("beeindig-bewerken-cel");
		beeindigBewerken.classList.add("beeindig-bewerken-multi");

		const namen = rijenInBewerking.map((rij) => {
			return rij.naam;
		});

		const multiRijUitleg = document.createElement("div");
		multiRijUitleg.className = "multi-rij-uitleg";
		multiRijUitleg.innerHTML = `<h2 class='form-rij-titel'>Je bewerkt meerdere rijen in &eacute;&eacute;n keer.</h2>
		<p class='form-rij-tekst'>In ieder veld waar je iets invuld zal dit alle voorgaande data bij al deze rijen overschrijven bij de volgende rijen: :</p>
		<ol class='form-rij-lijst'>
			${namen
				.map((naam) => {
					return `<li class='form-rij-lijst-stuk'>${naam}</li>`;
				})
				.join("")}
		</ol>`;
		multiRij.appendChild(multiRijUitleg);
	});
}

function zetClickBeeindigMultiBewerker() {
	gr.el("grote-categorie-formulier").addEventListener(
		"click",
		beeindigMultiBewerken
	);
}
function beeindigMultiBewerken(e) {
	if (
		!gr.vindInOuders(
			e.target,
			(element) => {
				return element.classList.contains("beeindig-bewerken-multi");
			},
			3
		)
	) {
		return;
	}
	e.preventDefault();

	const groepNaam = gr.el("pers-multi-rij-groep").value;
	const sectorNaam = gr.el("pers-multi-rij-sector").value;
	const contactNaam = gr.el("pers-multi-rij-contact").value;
	const woonplaatsNaam = gr.el("pers-multi-rij-woonplaats").value;
	const ikWil = gr.el("pers-multi-rij-ik_wil").value;

	const rijenInBewerking = gr.zichtbarePersRijen();
	rijenInBewerking.forEach((persoonRij) => {
		const rij = persoonRij.element;
		if (groepNaam.length) {
			gr.el('[data-naam="groep"]', rij).value = groepNaam;
			gr.el(".pers-lezen__groep", rij).innerHTML = groepNaam;
		}
		if (sectorNaam.length) {
			gr.el('[data-naam="sector"]', rij).value = sectorNaam;
			gr.el(".pers-lezen__sector", rij).innerHTML = sectorNaam;
		}
		if (contactNaam.length) {
			gr.el('[data-naam="contact"]', rij).value = contactNaam;
			gr.el(".pers-lezen__contact", rij).innerHTML = contactNaam;
		}
		if (woonplaatsNaam.length) {
			gr.el('[data-naam="woonplaats"]', rij).value = woonplaatsNaam;
			gr.el(".pers-lezen__woonplaats", rij).innerHTML = woonplaatsNaam;
		}
		if (ikWil.length) {
			gr.el('[data-naam="ik_wil"]', rij).value = ikWil;
			gr.el(".pers-lezen__ik_wil", rij).innerHTML = ikWil;
		}
	});
	DB().handmatigeSelectie = false;
	DB().multiBewerk = false;
}

function toggleMultiBewerk(e) {
	e.preventDefault();
	const db = DB();
	NavElement.sluitAlleNavElementen();
	db.multiBewerk = !db.multiBewerk;
}

/**
 * zet lijst buttons click handlers.
 */
function zetLijstKnoppenClicks() {
	gr.pakElementVeilig("lijst-mail-button").addEventListener("click", (e) => {
		maakLijst("mail", e);
	});
	gr.pakElementVeilig("lijst-telefoon-button").addEventListener(
		"click",
		(e) => {
			maakLijst("telefoon", e);
		}
	);
	gr.pakElementVeilig("lijst-telefoon-multi").addEventListener("click", (e) => {
		maakLijst("multi", e);
	});
}

function zetRiseupCheckButtonClick() {
	if (
		location.href.includes("contacten") ||
		location.href.includes("bondgenoten")
	)
		return;

	gr.pakElementVeilig("riseup-check").addEventListener("click", (e) => {
		e.preventDefault();
		riseupCheck(e);
	});
}

/**
 * knalt emails in script dat valt te gebruiken in de console van riseup.
 */
function riseupCheck(e) {
	const mailsVanLedenUitCRM = gr
		.elArray('.pers-input[type="email"]')
		.map((emailVeld) => {
			return emailVeld.value.toLowerCase().trim();
		});
	const mailsVanLedenUitCRMJSON = JSON.stringify(mailsVanLedenUitCRM);
	const riseupScript = maakRiseupScript(mailsVanLedenUitCRMJSON);
	gr.communiceer(pakTekst("riseup"));
	gr.schrijfNaarClipboard(riseupScript, !!e);
	setTimeout(() => {
		window.open(
			"https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500"
		);
	}, 3000);
}

/**
 * mapt over rijen en haalt van getoonde rijen data op,
 * schrijft die naar de printer, stuurt clipboard aan.
 * creeert handige buttons om andere programma's mee te openen zoals mail/sms
 *
 * @param {string} lijstWat mail|telefoon
 * @param {event} event click event
 */
function maakLijst(lijstWat, event = null) {
	event && event.preventDefault();
	const isMail = lijstWat === "mail";
	const isMulti = lijstWat === "multi";
	const printMetNamen = gr.el("lijst-ook-naam").checked;
	let printTekst = "";
	let linkHref = "";
	let ankerHTML = "";

	const persRijen = gr.zichtbarePersRijen();

	// MAIL
	if (isMail) {
		persRijen
			.filter((P) => P.heeftGeldigeEmail)
			.forEach((P, index) => {
				if (printMetNamen) {
					printTekst += `${P.naam} &lt;${P.email}&gt;, `.toLowerCase();
					linkHref += `${P.naam} <${P.email}>, `.toLowerCase();
				} else {
					linkHref += `${P.email}, `.toLowerCase();
					printTekst += `${P.email}, `.toLowerCase();
				}
			});
		const a = encodeURIComponent(linkHref);
		ankerHTML = `
      <span class='print-buttons-text'>Mail deze ${persRijen.length} adressen in </span><a class='print-button mail-cc' href='mailto:info@vloerwerk.org?cc=${a}'>CC</a><a class='print-button mail-bc' href='mailto:info@vloerwerk.org?bcc=${a}'>BCC</a>      
		`;
	} else if (isMulti) {
		const tabelRijen = persRijen
			.map((P) => {
				return `<tr>
				<td>${P.naam}</td>
				<td>${P.heeftGeldigeTel ? P.telefoon : ""}</td>
				<td>${P.heeftGeldigeEmail ? P.email : ""}</td>
			</tr>`;
			})
			.join("");

		linkHref =
			`CRM uitdraai ${new Date().toLocaleString()} \n\n` +
			persRijen
				.map((P) => {
					return `${P.naam.padEnd(25, " ")}${P.heeftGeldigeTel ? P.telefoon.padEnd(15, " ") : "".padEnd(15, " ")
						}${P.heeftGeldigeEmail ? P.email : ""}\n`;
				})
				.join("");

		printTekst = `
			<p>Als je 'm als een nette tabel wilt moet je 'm wel met de hand kopie&euml;ren.</p>
			<table id='crm-uitdraai'>
				<caption>CRM uitdraai ${new Date().toLocaleString()}</caption>
				<thead>
					<th><strong>Naam</strong></th>
					<th><strong>Telefoon</strong></th>
					<th><strong>Email</strong></th>
				</thead>
				<tbody>
					${tabelRijen}
				</tbody>
			</table>
		`;

		ankerHTML = ``;
	} else {
		// TELEFOON
		persRijen
			.filter((P) => P.heeftGeldigeTel)
			.forEach((P) => {
				const t = P.telefoon.replace(/[\s-]/, "");
				printTekst += printMetNamen ? `${P.naam}: ${t}<br>` : `${t}, `;
				linkHref += `${t}, `;
				const a = encodeURIComponent(linkHref);
				ankerHTML = !printMetNamen
					? `
      <span class='print-buttons-text'>Stuur:</span>
      <a class='print-button tel-sms' href='sms:${a}'>SMS (mobiel)</a>`
					: "";
			});
	}

	const printHTML = `
	  <span id='copyboard-succes'></span>
		<small>${printTekst}</small>
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
	const nieuweId = maakNieuweId(formRijen);
	let legeHouderDiv = document.createElement("div");

	// regex replaces
	legeHouderDiv.innerHTML = maakLegePersoonRij(nieuweId);
	// inputs leeggooien
	const legeClone = legeHouderDiv.querySelector(".form-rij");
	gr.el("form-rijen-lijst").appendChild(legeClone);

	//
	const oudeStijl = document
		.querySelector(".form-rij[style*=background]")
		.getAttribute("style");
	legeClone.setAttribute("style", oudeStijl);

	gr.el("voeg-rij-toe").removeAttribute("disabled");
	const db = DB();
	db.bewerkModus = true;
	db.rijInBewerking = new PersoonRij(legeClone);

	NavElement.sluitAlleNavElementen();
}

/**
 * berekend hoogste ID waarde en geeft één hoger terug.
 * helper van voegPersoonToe
 *
 * @param {*} persoonRijen
 */
function maakNieuweId(rijen) {
	const id =
		Math.max(
			...rijen.map((rij) => {
				const id = rij.querySelector(".pers-id").value;
				return Number(id) || 0;
			})
		) + 1;
	return id;
}

function pakVandaagString() {
	var datumInstance = new Date();
	var vandaag =
		datumInstance.getDate() +
		"-" +
		(datumInstance.getMonth() + 1) +
		"-" +
		datumInstance.getFullYear();
	return vandaag;
}

function zetLuisterRegistratieViaJSONChange() {
	gr.el('app-body').addEventListener('keydown', e => {
		if (e.target.id === 'json-invoer') {
			if (e.ctrlKey && e.key === 'v') {
				setTimeout(() => {
					verwerkRegistratieJSON(e)
				}, 150)
			}
		}
	})
	gr.el('app-body').addEventListener('change', e => {
		if (e.target.id === 'json-invoer') {
			setTimeout(() => {
				verwerkRegistratieJSON(e)
			}, 150)
		}
	})
}

function verwerkRegistratieJSON(e) {
	if (!document.getElementById('json-invoer')) {
		return;
	}
	try {
		const registratieData = gr.el('json-invoer').value.replace(/PLAKINCRM/g, '').replace(/\n/g, '').split(',');

		if (!registratieData || !registratieData.length) {
			return;
		}
		registratieData.forEach(datumRij => {
			if (!datumRij.includes(':')) {
				return;
			}
			const [veldNaam, data] = datumRij.split(':')
			const zuivereData = data.replace(/[\"\`]/g, '').replace(/LINEBREAK/g, `\n`).trim();
			console.log(zuivereData)
			const veld = gr.el(`.bewerk-modus .geen-data[data-naam="${veldNaam}"]`);
			if (veld) {
				veld.value = zuivereData
			}
		})

		gr.communiceer('Succesvol overgenomen!', 1000)
		gr.el('json-invoer-wrapper').parentNode.removeChild(gr.el('json-invoer-wrapper'))


	} catch (error) {
		gr.communiceer(`Invoer is niet goed (genoeg). Computer zegt: ${error.message}`)
		console.error(error);
	}

}

function maakLegePersoonRij(id) {
	return `
	<div id="form-rij-${id}" class="form-rij" style="">
	<button class="start-bewerken-cel"></button>
		<button class="beeindig-bewerken-cel"></button>
		<button title='zet deze persoon over naar andere tabel' id='transfer-cel-${id}' class='transfer-cel'></button>
		<button title='voeg toe aan selectie' class='rij-in-handmatige-selectie'></button>
		<div class="rij-verwijderen form-cel">
			<input class="pers-id" id="pers-${id}-id" type="hidden" name="form[${id}][id]" data-naam="id" value="${id}">
		</div>
		<div class="cel-naam form-cel">
			<input class="pers-input" id="pers-${id}-naam" name="form[${id}][naam]" type="text" placeholder="naam" data-naam="naam">
			<span data-naam="naam" id="lees-${id}-naam" class="pers-lezen pers-lezen__naam"></span>
		</div>
		<div class="cel-groep form-cel">
			<input class="pers-input" id="pers-${id}-groep" name="form[${id}][groep]" type="groep" placeholder="groep" data-naam="groep">
			<span data-naam="groep" id="lees-${id}-groep" class="pers-lezen pers-lezen__groep"></span>
		</div>
		<div class="cel-sector form-cel">
			<input class="pers-input" id="pers-${id}-sector" name="form[${id}][sector]" type="sector" placeholder="sector" data-naam="sector">
			<span data-naam="sector" id="lees-${id}-sector" class="pers-lezen pers-lezen__sector"></span>
		</div>
		<div class="cel-contact form-cel">
			<input class="pers-input" id="pers-${id}-contact" name="form[${id}][contact]" type="contact" placeholder="contact" data-naam="contact">
			<span data-naam="contact" id="lees-${id}-contact" class="pers-lezen pers-lezen__contact"></span>
		</div>
		<div class="cel-woonplaats form-cel">
			<input class="pers-input" id="pers-${id}-woonplaats" name="form[${id}][woonplaats]" type="woonplaats" placeholder="woonplaats" data-naam="woonplaats">
			<span data-naam="woonplaats" id="lees-${id}-woonplaats" class="pers-lezen pers-lezen__woonplaats"></span>
		</div>
		<div class="cel-email form-cel">
			<input class="pers-input" id="pers-${id}-email" name="form[${id}][email]" type="email" required="" placeholder="email" data-naam="email">
			<span data-naam="email" id="lees-${id}-email" class="pers-lezen pers-lezen__email"></span>
		</div>
		<div class="cel-telefoon form-cel"> 
			<input class="pers-input" id="pers-${id}-telefoon" name="form[${id}][telefoon]" type="tel" placeholder="telefoon" data-naam="telefoon">
			<span data-naam="telefoon" id="lees-${id}-telefoon" class="pers-lezen pers-lezen__telefoon"></span>
		</div>
		<div class="cel-laatst_gezien form-cel">
			<span class="cel-vervanger">
				<input class="pers-input" id="pers-${id}-laatst_gezien" name="form[${id}][laatst_gezien]" type="tel" placeholder="laatst_gezien" value="${pakVandaagString()}" data-naam="laatst_gezien">
				<span data-naam="laatst_gezien" id="lees-${id}-laatst_gezien" class="pers-lezen pers-lezen__laatst_gezien"></span>
				<button class="update-laatst-gezien">NU</button>
			</span>
		</div>
		<div class="cel-ik_wil form-cel">
			<textarea class="pers-input" id="pers-${id}-ik_wil" name="form[${id}][ik_wil]" placeholder="ik wil" data-naam="ik_wil"></textarea>
			<span data-naam="ik_wil" id="lees-${id}-ik_wil" class="pers-lezen pers-lezen__ik_wil"></span>
		</div>
		<div class="cel-aantekening form-cel">
			<textarea class="pers-input geen-data" id="pers-${id}-aantekening" name="form[${id}][aantekening]" placeholder="aantekening" data-naam="aantekening"></textarea>
			<span data-naam="aantekening" id="lees-${id}-aantekening" class="pers-lezen pers-lezen__aantekening"></span>
		</div>
		<div id='json-invoer-wrapper' class='json-invoer'>
		<label for='json-invoer' class='json-invoer-tekst json-invoer-element json-invoer-element--label'>Vul data nieuwe registratie vanuit mail-data.</label>
		<textarea class='json-invoer-element json-invoer-element--textarea' id='json-invoer'></textarea>
		</div>
	</div>
	`;
}
