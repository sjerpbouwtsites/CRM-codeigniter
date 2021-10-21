/**
 * maakt script dat uitgevoerd wordt in riseup om inhoud CRM leden en ledenlijst te vergelijken. 
 *
 * @param {string} mailsVanLedenUitCRMJSON
 * @returns javascript
 */
export default function maakRiseupScript(mailsVanLedenUitCRMJSON){
return `

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
      riseupAnker.parentNode.parentNode.title = "Ik zit wel in Riseup, maar niet in de CRM ledencategorie."    
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

VWinitRiseupScript()`  
}