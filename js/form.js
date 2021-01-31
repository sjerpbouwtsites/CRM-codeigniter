const staat = {
	ontsleuteld: false,
	wachtwoord: null,
	dev: location.href.includes("localhost"),
};

var acties = {
	resetForm() {
		document.getElementById("grote-tabel-formulier").reset();
	},
	updateLaatsGezien() {
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
	},
	verwijderen: function () {
		//verwijder functionaliteit
		$("form").on("click", ".rij-verwijderen", function (e) {
			e.preventDefault();

			//als meer dan één aanwezig, verwijderen, anders legen.

			if ($(".form-rij:not(.kop)").length > 1) {
				$(e.target).closest(".form-rij:not(.kop)").remove();
			} else {
				$(e.target)
					.closest(".form-rij:not(.kop)")
					.find("input, textarea")
					.each(function () {
						if (this.getAttribute("data-naam") !== "id") {
							this.value = "";
						}
					});
			}
		});
	},

	ongedaanMaken: function () {
		$(".ongedaan").on("click", function (e) {
			e.preventDefault();
			if (confirm("Alle wijzigingen in dit scherm wissen?")) {
				location.reload(true);
			}
		});
	},
	mobielActieveldenTonen: function () {
		$("#mobiel").on("click", ".mob-toon", function (e) {
			e.preventDefault();
			var sel = "." + this.getAttribute("data-toon");
			console.log(sel);
			$(sel).toggle();
		});
	},
	sluitPrinter: function () {
		var p = document.getElementById("printer");
		var s = document.getElementById("sluit-printer");
		s.addEventListener("click", function (e) {
			e.preventDefault();
			p.getElementsByTagName("p")[0].innerHTML = "";
			$("#printer").hide(200);
		});
	},
	sluitActieveld: function () {
		$("#sluit-form-acties").on("click", function (e) {
			e.preventDefault();
			$(".actieveld.form-acties").hide(200);
		});
	},

	wachtwoordVeldNawerk: function () {
		const o = document.getElementById("ontsleutel");
		o.value = "";
		o.focus();
	},
};

function stapelFilters() {
	return !!$("#stapel-filters:checked").length;
}

function lijstOokNamen() {
	return !!$("#lijst-ook-naam:checked").length;
}

function dezeRijNaam(el) {
	if (!window.alGedaanNaam) {
		window.alGedaanNaam = true;
		console.log("el", el);
		console.log("rij", $(el).closest(".form-rij"));
		console.log("naam", $(el).closest(".form-rij").find('[data-naam="naam"]'));
	}

	return $(el).closest(".form-rij").find('[data-naam="naam"]').val();
}

var naDecryptie = {
	vulSelects: function () {
		Array.from(document.getElementsByClassName("selectie-filter")).forEach(
			(selectElement) => {
				const filtert = selectElement.getAttribute("data-filter");
				const moetGesplit = selectElement.getAttribute("data-split");
				const gerelateerdeInvoerVelden = document.querySelectorAll(
					`.pers-input[data-naam='${filtert}']`
				);
				const invoerVeldenValues = Array.from(gerelateerdeInvoerVelden)
					.map((veld) => veld.value)
					.map((veldValue) => {
						if (moetGesplit) {
							return veldValue.split(" ");
						} else {
							return veldValue;
						}
					})
					.sort()
					.reverse();

				const uniekeWaarden = [];
				invoerVeldenValues.forEach((v) => {
					if (!v) {
						return;
					}
					if (typeof v === "string") {
						if (!uniekeWaarden.includes(v)) {
							uniekeWaarden.push(v);
						}
					} else {
						// dus array
						v.forEach((w) => {
							if (!uniekeWaarden.includes(w)) {
								uniekeWaarden.push(w);
							}
						});
					}
				});

				const icon = Math.random() > 0.5 ? "🔎" : "🔍";

				selectElement.innerHTML = `
						<option value=''>${filtert} <span class='select-icon'>${icon}</span></option>
						${uniekeWaarden
							.map((optie) => {
								return `<option value='${optie}'>${optie}</option>`;
							})
							.join("")}
					`;
			}
		);
	},
};

/**
 * helper van form.ontsleutel.
 * @returns Promise<string:wachtwoord|Error>
 */
function sleutelInputPromise() {
	return new Promise((sleutelResolve, sleutelReject) => {
		sleutelEl = document.getElementById("ontsleutel");
		if (!sleutelEl) {
			const e = new Error("Je vulde niets in.");
			staat.wachtwoord = null;
			sleutelReject(addErrorOrigin(e, "ontsleutel sleutel veld lezen."));
			return;
		} else {
			staat.wachtwoord = sleutelEl.value;
			sleutelResolve(sleutelEl.value);
		}
	});
}

var form = {
	ontsleutel: function () {
		// enter terwijl in invoerveld = klik button
		document
			.getElementById("ontsleutel")
			.addEventListener("keyup", function (e) {
				if (e.key.toLowerCase() === "enter") {
					e.preventDefault();
					$("button.ontsleutel").click();
				}
			});

		document
			.getElementById("ontsleutel-knop")
			.addEventListener("click", (ontsleutelButtonEvent) => {
				ontsleutelButtonEvent.preventDefault();

				sleutelInputPromise()
					.then((sleutel) => {
						// oooover de velden heen.
						return maakSleutelEnOntsleutel(sleutel);
					})
					.then(() => {
						document
							.getElementById("grote-tabel-formulier")
							.classList.add("ontsleuteld");
						document.getElementById("sleutelaars").classList.add("ontsleuteld");
						staat.ontsleuteld = true;
						initActies();
					})

					.then(() => {})
					.catch((e) => {
						communiceer(`fout in het ontsleutelen ${e.message}`);
						e.origin ? console.dir(e) && console.stack(e) : console.error(e);
					});
			});
	},
	verzendenInStukken: function () {
		const groteFormulier = document.getElementById("grote-tabel-formulier");
		const groteFormulierVerzendKnop = document.getElementById(
			"verzend-grote-formulier-knop"
		);
		groteFormulierVerzendKnop.addEventListener(
			"click",
			verzendInStukkenCallback
		);
		groteFormulier.addEventListener("submit", verzendInStukkenCallback);
	},
};

function verzendInStukkenCallback(e) {
	e.preventDefault();
	//button disablen
	document
		.getElementById("verzend-grote-formulier-knop")
		.setAttribute("disabled", true);
	// eerst versleutelen
	if (!staat.wachtwoord) throw new Error("wachtwoord vergeten door app");
	const versleutelMet = staat.wachtwoord;
	maakSleutelEnVersleutel(versleutelMet)
		.then(() => {
			document
				.getElementsByTagName("body")[0]
				.classList.add("voorbereid-op-afsluiten");
			communiceer("Versleuteld. Nu comprimeren en versturen.", 1000);
			const groteFormulier = document.getElementById("grote-tabel-formulier");
			const formDataSys = new FormData(groteFormulier);

			/**
			 * makkelijker te verzenden en beter te vertalen naar SQL
			 */
			const SQLVriendelijkePostData = {
				meta: {},
				ids: [],
				kolommen: [],
				waardenPerId: {},
			};
			// voor bereiden met de ids.
			Array.from(formDataSys.entries())
				.filter(([key, value]) => key.includes("[id]"))
				.forEach(([key, uniekeIdUitForm]) => {
					SQLVriendelijkePostData.ids.push(uniekeIdUitForm);
					SQLVriendelijkePostData.waardenPerId[uniekeIdUitForm] = [];
				});

			// kolommen bepalen
			const eersteId = SQLVriendelijkePostData.ids[0];
			const eersteRijInputs = document
				.querySelector(".form-rij")
				.querySelectorAll(".pers-input");
			SQLVriendelijkePostData.kolommen = Array.from(eersteRijInputs)
				.map((veld) => {
					return veld.getAttribute("data-naam");
				})
				.filter((veldNaam) => {
					return veldNaam !== "id";
				});

			// per id waardenPerId invullen.
			Array.from(formDataSys.entries()).forEach(([key, value]) => {
				if (key.includes("form_meta") || key.includes("[id]")) {
					return;
				}
				const id = key.replace(/\D/g, "");
				SQLVriendelijkePostData.waardenPerId[id].push(value);
			});

			// tenslotte de meta data
			SQLVriendelijkePostData.meta = {
				xsrf: formDataSys.get("form_meta[csrf-token]"),
				iv: formDataSys.get("form_meta[iv]"),
				tabel: formDataSys.get("form_meta[tabel_naam]"),
			};

			return axios
				.request({
					url: document.getElementById("grote-tabel-formulier").action,
					method: "post",
					data: SQLVriendelijkePostData,
				})
				.then((antwoord) => {
					// afsluiten
					communiceer(
						`Gelukt! Server zegt: ${antwoord.data}. Dit programma sluit nu af.`,
						2000
					);
					document.getElementsByTagName("body")[0].classList.add("afsluiten");
				})
				.catch((e) => {
					console.log(e);
					document
						.getElementsByTagName("body")[0]
						.classList.remove("voorbereid-op-afsluiten");

					try {
						communiceer(
							`En dat is een fout!
						De server zegt: ${e}`,
							5000
						);
					} catch (error) {
						alert(
							"er ging iets fout, ergens, en bij het lezen van de fout ging iets fout, of de fout is niet begrepen."
						);
						throw error;
					}
				});
		}) // then van maakSleutelEnVersleutel
		.catch((e) => {
			communiceer(`fout in de versleuteling ${e}`, 1000);
			throw e;
		});
}

function initActies() {
	//filters e.d. vullen met nieuwe info
	for (var f in naDecryptie) naDecryptie[f]();

	communiceer("CRM geinitialiseerd");
}

$(function () {
	if (!window.crypto) {
		if (
			confirm(
				"Boodschap van Sjerp: je browser is inadequaat. Download een nieuwe.\nSnap je het niet bel dan 0616541143."
			)
		) {
			location.href = "https://firefox.com";
		} else {
			location.href = "http://www.rmo.nl/";
		}
	}

	//executeer alle func objen
	var fo = [acties, form],
		fol = fo.length,
		i,
		fn;

	//de voornaamste reden dat zit is opgeschreven is dat het onleesbaar is.
	for (i = 0; i < fol; i++) for (fn in fo[i]) fo[i][fn]();

	// auto decrypt op dev
	alsOpLocalHostOnthoudDecrypieEnVoerIn();
});

function communiceer(tekst, tijd) {
	$("#printer p").empty().append(tekst);
	$("#printer").fadeIn(200);
	/*	printer.getElementsByTagName('p')[0].textContent = tekst;
	printer.style.display = "block";*/

	if (tijd) {
		setTimeout(function () {
			$("#printer").fadeOut(200);
		}, tijd);
	}
}
