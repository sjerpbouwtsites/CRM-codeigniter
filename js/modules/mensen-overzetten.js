/**
 * Dit bestand regel het overzetten van een contact naar een lid.
 */

import * as gr from "./gereedschap.js";
import PersoonRij from "./persoon-rij.js";

export default function mensenOverzettenInit() {
  initieerStorage();
  zetTransferClick()
  zetOntvangTransferEvent();
}

// indien de storage niet als null wordt geiniteerd, lukt de storage event niet.
function initieerStorage() {
  localStorage.setItem('mensTransfer', null)
}

/**
 * Contacten kant.
 * ontvangt click van rij. Maakt van rij een PersoonRij klasse
 * die wordt omgezet naar JSON en dan de storage ingaat. 
 * @param {rijClickEvent} e 
 */
function doeTransfer(e) {
  if (!location.href.includes('categorie/contacten')) {
    return;
  }
  localStorage.setItem('mensTransfer', null)
  const rijGeklikt = gr.vindInOuders(e.target, (element) => {
    return element.classList.contains("form-rij");
  }, 8);
  if (!rijGeklikt) {
    return;
  }
  const rijPersoon = new PersoonRij(rijGeklikt);
  const mensData = mensNaarData(rijPersoon)
  localStorage.setItem('mensTransfer', mensData);
}

/**
 * Leden kant.
 * zet window storage event. data uit localstorage wordt door Persoonrij gehaald die een nieuw gemaakt record vult.
 */
function zetOntvangTransferEvent() {
  if (location.href.includes('categorie/contacten') || location.href.includes('categorie/bondgenoten')) {
    return;
  }

  window.addEventListener('storage', event => {
    if (event.key !== 'mensTransfer') {
      return;
    }
    const nieuwLid = JSON.parse(localStorage.getItem('mensTransfer'));
    gr.el("voeg-rij-toe").click();
    const bewerkendePersoonRij = new PersoonRij(document.querySelector('.form-rij.bewerk-modus'));
    for (let sleutel in nieuwLid) {
      console.log(sleutel);
      bewerkendePersoonRij[sleutel] = nieuwLid[sleutel]
    }
    bewerkendePersoonRij.schrijfDataNaarLeesVeldenEnZetGeenDataClass();
  })
}

function zetTransferClick() {
  gr.el("form-rijen-lijst").addEventListener("click", (e) => {
    if (!e.target.classList.contains('transfer-cel')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    doeTransfer(e)
  });
}

/**
 * mapt aan de hand van de naamIdMap van PersoonRij een JSON object
 * @param {*} persoonRij 
 * @returns json object van persoon
 */
function mensNaarData(persoonRij = {}) {
  const r = {};
  Object.keys(persoonRij.naamIdMap).forEach(naam => {
    r[naam] = persoonRij[naam];
  })
  return JSON.stringify(r)
}