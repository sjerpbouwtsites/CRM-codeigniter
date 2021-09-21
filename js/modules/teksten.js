const riseup = () => {
	return `Er is zojuist een script naar je klikbord gekopie&euml;rd. Er wordt over 3 seconden een tabblad geopend met de pagina van riseup waar je dient te zijn: Vloerwerk ledenlijst, 500 resultaten per pagina. <a target='_blank' href='https://lists.riseup.net/www?sortby=email&action=review&list=vloerwerk-leden&size=500#missende-leden'>Zo niet klik dan hier</a><br><br><strong>☣☣☣</strong><br>Nu ga je dit script uitvoeren op die pagina. Klik op die pagina op <kbd>f12</kbd>, klik op het tabblad console in de developer tools en druk daar op <kbd>control c</kbd> en dan <kbd>enter</kbd>.<br><br><span id='copyboard-succes'></span>`;
};
const ikWilControleTeVeelTermen = (ikWilTermenLengte, invoer) => {
  return `Het veld 'ik wil' is voor steekwoorden als plakken, schrijven, klussen, spreken. Niet voor zinnen. Je hebt ${ikWilTermenLengte} termen gebruikt. Weet je zeker dat <em>${invoer}</em> steekwoorden zijn?`  
}
const ikWilControleNieuweTermenOverdaad = (ikWilTermenLengte, nieuweTermen, invoer) => {return `Het veld 'ik wil' is voor steekwoorden als plakken, schrijven, klussen, spreken. Niet voor zinnen. Je hebt ${ikWilTermenLengte} termen gebruikt waarvan er ${nieuweTermen} niet voorkomen bij anderen. Weet je zeker dat <em>${invoer}</em> steekwoorden zijn?`}

/**
 * zet hierin alle tekst object ofwel direct of via referentie.
 **/
const teksten = {
	riseup,
  ikWilControleTeVeelTermen,
  ikWilControleNieuweTermenOverdaad
};

/**
 * pak tekst adhv taal uit teksten object.
 *
 * @param {*} naam sleutel in teksten object.
 * @param {string} [taal='nl'] optionele taal.
 * @returns string
 */
export default function pakTekst(naam, taal = "nl", ...tekstArgumenten) {
	if (!Object.keys(teksten).includes(naam)) {
		throw new Error(`tekst ${naam} bestaat niet`);
	}

	const tekst = teksten[naam];

	if (typeof tekst === "function") {
		return tekst(...tekstArgumenten);
	}

	if (!tekst[taal] && !tekst["nl"]) {
		const eersteTaal = Object.keys(tekst)[0];
		console.warn(`voorkeurstaal en NL niet ingevuld voor tekst ${naam}`);
		return tekst[eersteTaal](...tekstArgumenten);
	}

	if (!tekst[taal]) {
		return tekst["nl"](...tekstArgumenten);
	}

	return tekst[taal](...tekstArgumenten);
}
