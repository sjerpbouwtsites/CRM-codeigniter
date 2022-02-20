import panelenInit from "./modules/paneel-acties.js";
import navigatieAnimatie, { NavElement } from "./modules/navigatie-animatie.js";
import formulierInit, { formulierOntsleutelingsAnimatie, triggerClickSorteerOpNaam } from "./modules/formulier.js";
import devExInit from "./modules/dev-ex.js";
import * as encryptie from "./modules/encryptie.js";
import printerInit from "./modules/printer.js";
import DB from "./modules/database.js";
import * as uiDiversen from "./modules/ui-diversen.js";
import nieuweCategorieInit from "./modules/nieuwe-categorie.js";
import bugsnagInit from "./modules/bugsnag.js";
import mensenOverzettenInit from "./modules/mensen-overzetten.js";
import { zichtbarePersRijen } from "./modules/gereedschap.js";
import PersoonRij from "./modules/persoon-rij.js";



var globalCtrlIsPushed = false;
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    alert('sorry je PC ondersteunt geen copy paste in browser')
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}


function zetTijdelijkKopieerMetCtrl(){


document.body.addEventListener('keydown', function(event) {

  if (event.ctrlKey) {
    globalCtrlIsPushed = true;
  }

});

document.body.addEventListener('keyup', function(event) {

  if (event.ctrlKey) {
    globalCtrlIsPushed = false;
  }

});

document.body.addEventListener('click', function(event) {
  if (!event.target.classList.contains('pers-lezen')) {
    return;
  }
  copyTextToClipboard(event.target.textContent.trim());
});


}


function indexInit() {

	try {
		bugsnagInit();
	} catch (error) {
		console.error(error);
		return;
	}

	// dingen die gaan draaien na decryptie. async.
	DB()
		.alsVeranderdDoe('ontsleuteld', () => {
			if (!DB().ontsleuteld) {
				return;
			}
			uiDiversen.laadEvtAndereBladen();
			navigatieAnimatie();
			formulierInit();
			panelenInit();
			encryptie.encryptieInit();
			printerInit();
			uiDiversen.zetEscapeKlikVoorAlles()
			encryptie.alsWachtwoordGewijzigd();
			triggerClickSorteerOpNaam();
			mensenOverzettenInit();
			zichtbarePersRijen().forEach(PersoonRij => {
				PersoonRij.zetPersoonsLabels();
			})
		})

	// sync

	encryptie.decryptieInit();
	formulierOntsleutelingsAnimatie();
	uiDiversen.afsluitingsAnimatieHandler();
	nieuweCategorieInit();
	uiDiversen.naOpslaanHerlaadfunctionaliteit();
	uiDiversen.zetf5herladen();
	 zetTijdelijkKopieerMetCtrl();
	devExInit();

}
indexInit();
