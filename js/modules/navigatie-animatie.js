export default function navigatieAnimatie() {
	const navElsCSSSelector =
		"#crm-nav-menu, #crm-nav-filters, #crm-nav-acties, #crm-nav-config";
	const navKnopElsCSSSelector =
		"#schakel-navigatie-menu, #schakel-navigatie-filters, #schakel-navigatie-acties, #schakel-navigatie-config";

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
