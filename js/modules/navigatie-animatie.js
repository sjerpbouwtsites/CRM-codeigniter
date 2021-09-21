import * as gr from "./gereedschap.js";

export default function navigatieAnimatie() {
	const navElsCSSSelector =
		"#crm-nav-menu, #crm-nav-filters, #crm-nav-acties, #crm-nav-config";
	const navKnopElsCSSSelector =
		"#schakel-navigatie-menu, #schakel-navigatie-filters, #schakel-navigatie-acties, #schakel-navigatie-config";

	const navKnoppen = gr.elArray(navKnopElsCSSSelector);

	// nu nog muisover status zetten die tegenhoud dat menu's inklappen.
	// muisover staat dus in data ttr muis over.
	const navs = gr.elArray(navElsCSSSelector).map(
		(navEl) => {
			return new NavElement(navEl);
		}
	);
	zetMuisOverEventHandlers(navs);

	navKnoppen.forEach((navKnopEl) => {
		navKnopEl.addEventListener("click", (navEvent) => {
			navEvent.preventDefault();
			const eigenNav = new NavElement(navKnopEl.getAttribute("data-eigen-nav"));
			// diegene die niet deze zijn sluiten
			navs
				.filter((nav) => {
					return nav.id !== eigenNav.id;
				})
				.forEach((nav) => {
					nav.sluit();
				});
			if (!eigenNav.toggleOpenDicht()) {
				return; // is nu dus dicht.
			}
			blijfProberenNavTeSluiten(eigenNav);
		});
	});
}
function zetMuisOverEventHandlers(navs) {
	navs.forEach((nav) => {
		nav.element.addEventListener("mouseenter", () => {
			nav.zetMuis();
		});
		nav.element.addEventListener("mouseleave", () => {
			nav.verwijderMuis();
		});
	});
}

/**
 * recursieve functie die grofweg iedere 3 seconden kijkt of de muis boven de nav is.
 *
 * @param {NavElement} navElement
 */
function blijfProberenNavTeSluiten(navElement, teller = 0) {
	// 10 keer opnieuw was wel genoeg.
	if (teller > 10) {
		return;
	}

	// lichtelijke verschillen hebben tussen menu, filter, evt. anderen.
	const wachtTijd = Math.floor((Math.random() - 0.5) * 500) + 2000;
	setTimeout(() => {
		if (navElement.heeftMuis()) {
			const nweTeller = teller + 1;
			blijfProberenNavTeSluiten(navElement, nweTeller);
			return; // mogelijk ingebruik.
		}
		navElement.sluit();
	}, wachtTijd);
}

//#region drag en drop

let elementDatWordtVersleept = null;
let startpuntSlepen = {
	screenX: null,
	screenY: null,
};
let eindpuntSlepen = {
	screenX: null,
	screenY: null,
};

function handleDragStart(e) {
	startpuntSlepen.screenX = e.screenX;
	startpuntSlepen.screenY = e.screenY;
	elementDatWordtVersleept = e.target;
	elementDatWordtVersleept.classList.add("wordt-gesleept");
	e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
	e.target.classList.remove("wordt-gesleept");
	!e.target.classList.contains("is-gesleept") &&
		e.target.classList.add("is-gesleept");
}
function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}

	return false;
}
function handleDrop(e) {
	e.stopPropagation();

	eindpuntSlepen.screenX = e.screenX;
	eindpuntSlepen.screenY = e.screenY;

	const verschilNaarRechts = startpuntSlepen.screenX - eindpuntSlepen.screenX;
	const verschilNaarBoven = eindpuntSlepen.screenY - startpuntSlepen.screenY;
	console.log(
		`naar rechts: ${verschilNaarRechts} komt van ${startpuntSlepen.screenX} en gaat naar ${eindpuntSlepen.screenX}`
	);

	const CSSWaarden = window.getComputedStyle(elementDatWordtVersleept);
	const oudRechts = Number(CSSWaarden.right.replace("px", ""));
	const oudTop = Number(CSSWaarden.top.replace("px", ""));

	elementDatWordtVersleept.setAttribute(
		"style",
		`
		right: ${oudRechts + verschilNaarRechts}px;
		top: ${oudTop + verschilNaarBoven}px;
		`
	);

	// nu nog de nav toggle knop verstoppen;
	const id = elementDatWordtVersleept.id;
	document.querySelector(`[data-eigen-nav="${id}"]`).classList.add("verborgen");

	elementDatWordtVersleept.classList.add("op-zijn-plek-gezet");
	return false;
}

document.addEventListener("dragover", handleDragOver, false);
document.addEventListener("drop", handleDrop, false);

document.querySelectorAll("[draggable='true']").forEach(function (sleepDing) {
	sleepDing.addEventListener("dragstart", handleDragStart, false);
	sleepDing.addEventListener("dragend", handleDragEnd, false);
});

//#endregion drag en drop

export class NavElement {
	id = null;
	/**
	 * @memberof navElement
	 */
	_nav = null;
	constructor(nav) {
		if (typeof nav === "string") {
			this._nav = document.getElementById(nav);
		} else {
			this._nav = nav;
		}
		this.id = this._nav.id;
	}
	
	static sluitAlleNavElementen(){
		gr.elArray('.crm-nav')
		.map((nav) => new NavElement(nav))
		.forEach((navElement) => {
			navElement.sluit();
		});		
	}
	get element() {
		return this._nav;
	}
	isOpen() {
		return this._nav.hasAttribute("data-nav-open");
	}
	open() {
		this._nav.setAttribute("data-nav-open", true);
	}
	sluit() {
		this._nav.removeAttribute("data-nav-open", true);
	}
	/**
	 * @returns {bool} als na toggle isOpen.
	 * @memberof NavElement
	 */
	toggleOpenDicht() {
		this.isOpen() ? this.sluit() : this.open();
		return this.isOpen();
	}
	heeftMuis() {
		return this._nav.hasAttribute("data-muis-over");
	}
	zetMuis() {
		this._nav.setAttribute("data-muis-over", true);
	}
	verwijderMuis() {
		this._nav.removeAttribute("data-muis-over");
	}
}
