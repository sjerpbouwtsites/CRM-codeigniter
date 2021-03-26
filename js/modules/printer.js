import * as gr from "./gereedschap.js";

export default function(){
  zetSluitPrinter();
  welkomstWoord ();
}

function zetSluitPrinter () {
  gr.el("sluit-printer")
  .addEventListener("click", function (e) {
    e.preventDefault();
    gr.el('.print-p').innerHTML = "";
    gr.el('printer').style.display = "none";
  });    
}


function welkomstWoord (){
	//filters e.d. vullen met nieuwe info

	const locationSplit = location.pathname.trim().split('/');
	const tabelNaam = location.pathname.includes('tabel') 
		? locationSplit[locationSplit.length-1] 
		: 'leden'

	setTimeout(()=>{
		gr.communiceer(`CRM geinitialiseerd. Je bent op ${tabelNaam}`, 2500);
	}, 500)	
}