export default function navigatieAnimatie() {
	const navElsCSSSelector = "#crm-nav-menu, #crm-nav-filters, #crm-nav-acties";
	const navKnopElsCSSSelector =
		"#schakel-navigatie-menu, #schakel-navigatie-filters, #schakel-navigatie-acties";

	alsEersteKeerInCRMToonNavigatie(navElsCSSSelector);

	const navKnoppen = document.querySelectorAll(navKnopElsCSSSelector);

	// nu nog muisover status zetten die tegenhoud dat menu's inklappen.
	// muisover staat dus in data ttr muis over.
	const navs = Array.from(document.querySelectorAll(navElsCSSSelector)).map(
		(navEl) => {
			return new NavElement(navEl);
		}
	);
	zetMuisOverEventHandlers(navs);

	navKnoppen.forEach((navKnopEl) => {
		navKnopEl.addEventListener("click", (navEvent) => {
			navEvent.preventDefault();
			const eigenNav = new NavElement(navKnopEl.getAttribute("data-eigen-nav"));
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

function alsEersteKeerInCRMToonNavigatie(navElsCSSSelector) {
	if (localStorage.getItem("vw-crm-eerder-bezocht") === "ja") return;
	console.log(" toon nav eerste keer CRM");
	const NavEls = Array.from(document.querySelectorAll(navElsCSSSelector)).map(
		(navEl) => new NavElement(navEl)
	);
	NavEls.forEach((nav) => nav.open());
	setTimeout(() => {
		NavEls.forEach((nav) => nav.sluit());
	}, Math.floor((Math.random() - 0.5) * 750) + 5000);
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
	const wachtTijd = Math.floor((Math.random() - 0.5) * 500) + 3000;
	setTimeout(() => {
		if (navElement.heeftMuis()) {
			const nweTeller = teller + 1;
			blijfProberenNavTeSluiten(navElement, nweTeller);
			return; // mogelijk ingebruik.
		}
		navElement.sluit();
	}, wachtTijd);
}

class NavElement {
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
		if (this._nav.hasAttribute("data-nav-open")) {
			this._nav.removeAttribute("data-nav-open");
		} else {
			this._nav.setAttribute("data-nav-open", true);
		}
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
