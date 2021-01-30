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
	toevoegen: function () {
		//laatste rij kopieeren;
		//vind hoogst aanwezige ID en geef die aan nieuwe rij.
		document
			.getElementById("voeg-rij-toe")
			.addEventListener("click", function (e) {
				e.preventDefault();
				document.getElementById("voeg-rij-toe").setAttribute("disabled", true);
				var formRijAr = Array.from(document.querySelectorAll(".form-rij"));
				var laatsteRij = formRijAr[formRijAr.length - 1];
				var htmlVanLaatsteRij = laatsteRij.outerHTML + " "; // fake een clone?
				var wrapper = document.createElement("div");
				wrapper.innerHTML = htmlVanLaatsteRij;
				const alleIdInputs = Array.from(document.querySelectorAll(".pers-id"));
				const hogerDanWelkIdAanwezig =
					Math.max(...alleIdInputs.map((input) => Number(input.value))) + 1;
				var cloneRij = wrapper.firstChild;
				var idVanLaatsteRij = laatsteRij.querySelector(".pers-id").value;
				Array.from(cloneRij.querySelectorAll("input, textarea")).forEach(
					(cloneInput) => {
						// update name.
						const nameNew = cloneInput
							.getAttribute("name")
							.replace(/\[\d+\]/, `[${hogerDanWelkIdAanwezig}]`);
						cloneInput.setAttribute("name", nameNew);

						// kan in de naam of value zitten.
						if (cloneInput.getAttribute("data-naam") === "id") {
							cloneInput.value = hogerDanWelkIdAanwezig;
						} else if (
							cloneInput.getAttribute("data-naam") === "laatst_gezien"
						) {
							cloneInput.value = new Date().toLocaleDateString();
						} else {
							cloneInput.value = "";
						}
						// niet zomaar op html string vervangen want kan ook in tel nr zitten
						cloneInput.setAttribute(
							"name",
							cloneInput.name.replace(idVanLaatsteRij, hogerDanWelkIdAanwezig)
						);
					}
				);

				cloneRij.id = `nieuwe-rij-${hogerDanWelkIdAanwezig}`;
				document.getElementById("form-rijen-lijst").appendChild(cloneRij);
				window.location.hash = cloneRij.id;
				document.getElementById("voeg-rij-toe").removeAttribute("disabled");
			});
	},
	selectieFilterChange: function () {
		$(".selectie-filter").on("change", function () {
			if (this.nodeName !== "SELECT") {
				throw new Error("geen idee wat hier nu weer gaande is pfff");
			}

			const laatstGekozenSelect = this;

			if (!laatstGekozenSelect.value) return;

			const stapelFiltersB = stapelFilters();

			let filterData = [];

			if (stapelFiltersB) {
				// we moeten de data van alle selects hebben.
				filterData = Array.from(laatstGekozenSelect.form)
					.filter((formElement) => {
						return formElement.classList.contains("selectie-filter");
					})
					.filter((selectElement) => {
						// nu diegeen er uit halen die geen keuze hebben, oftewel selectedIndex 0.
						return selectElement.selectedIndex !== 0;
					})
					.map((selectElement) => {
						// nu array maken met filter waardes voor controle
						// plus welke het laatst gewijzigd is.
						return {
							filterOp: selectElement.getAttribute("data-filter"), // de sleutel waarop gefilterd moet worden
							filterMet: selectElement.options[
								selectElement.selectedIndex
							].value.toLowerCase(),
							splitRijWaarden: selectElement.hasAttribute("data-split"),
						};
					});
			} else {
				// alleen laatste select pakken.
				if (laatstGekozenSelect.selectedIndex === 0) {
					return; // hier gaat niets mee gebeuren.
				} else {
					const fm =
						laatstGekozenSelect.options[laatstGekozenSelect.selectedIndex]
							.value;
					filterData.push({
						filterOp: laatstGekozenSelect.getAttribute("data-filter"),
						filterMet:
							!!fm && typeof fm !== "undefined" ? fm.toLowerCase() : null,
						splitRijWaarden: laatstGekozenSelect.hasAttribute("data-split"),
					});
				}
			}
			// nu per rij, per filterDataset, controleren.
			const rijenRes = Array.from(
				document.querySelectorAll(".form-rij + .form-rij")
			).map((rij) => {
				// array met bools en rij refs.
				const verzamelingBoolsofFiltersSucces = filterData.map(
					({ filterOp, filterMet, splitRijWaarden }) => {
						if (!splitRijWaarden) {
							// eenvoudige vergelijking
							return (
								rij
									.querySelector(`[data-naam=${filterOp}]`)
									.value.toLowerCase() === filterMet
							);
						} else {
							// een van de waarden in de rij-input moet overeen komen.
							return rij
								.querySelector(`[data-naam=${filterOp}]`)
								.value.toLowerCase()
								.split(" ")
								.includes(filterMet);
						}
					}
				);
				// als alles in de verzameling true is zijn alle filters succesvol.
				return {
					rij,
					succes: !verzamelingBoolsofFiltersSucces.includes(false),
				};
			});
			rijenRes.forEach(({ rij, succes }) => {
				rij.style.display = succes ? "flex" : "none";
			});
		});
	},

	selectieOngedaan: function () {
		// form native reset zorgt voor reset van filters e.d. hier alleen hide show
		document
			.getElementById("reset-navs-en-toon-alles")
			.addEventListener("click", (e) => {
				document.querySelectorAll(".form-rij + .form-rij").forEach((rij) => {
					rij.style.display = "flex";
				});
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
	sorteerOpLaatsGezien() {
		document
			.querySelector(".sorteer-op-laatst-gezien")
			.addEventListener("click", function (e) {
				e.preventDefault();

				var origineleFormTabel = document.querySelector(".form-tabel");

				// Add all lis to an array
				var rijen = Array.from(
					document.querySelectorAll(".form-tabel .form-rij.kop ~ .form-rij")
				).map((rij) => {
					Array.from(rij).forEach((cel) =>
						cel.classList.add("tering form-cel")
					);
					return rij;
				});

				// Sort the rijen in descending order
				rijen.sort(function (a, b) {
					const naamA = a
						.querySelector(".cel-laatst_gezien input")
						.value.split("-")
						.reverse();
					naamB = b
						.querySelector(".cel-laatst_gezien input")
						.value.split("-")
						.reverse();

					if (naamA > naamB) {
						return -1;
					}
					if (naamA < naamB) {
						return 1;
					}

					return 0;
				});

				origineleFormTabel.innerHTML = `
		    	<div class='kop form-rij'>${
						document.querySelector(".form-rij.kop").innerHTML
					}</div>
		    	${rijen
						.map((rij) => {
							return `<div class='form-rij'>${rij.innerHTML}</div>`;
						})
						.join("")}
		    `;
			});
	},
	sorteerOpNaam() {
		document
			.querySelector(".sorteer-op-naam")
			.addEventListener("click", function (e) {
				e.preventDefault();

				var origineleFormTabel = document.getElementById("form-rijen-lijst");

				// Add all lis to an array
				var rijen = Array.from(
					document.querySelectorAll(".form-tabel .form-rij.kop ~ .form-rij")
				).map((rij) => {
					Array.from(rij).forEach((cel) =>
						cel.classList.add("tering form-cel")
					);
					return rij;
				});

				// Sort the rijen in descending order
				rijen.sort(function (a, b) {
					const naamA = a.querySelector(".cel-naam input").value;
					naamB = b.querySelector(".cel-naam input").value;

					console.log(naamA, naamB);

					if (naamA < naamB) {
						return -1;
					}
					if (naamA > naamB) {
						return 1;
					}

					return 0;
				});

				origineleFormTabel.innerHTML = `
		    	<div class='kop form-rij'>${
						document.querySelector(".form-rij.kop").innerHTML
					}</div>
		    	${rijen
						.map((rij) => {
							return `<div class='form-rij'>${rij.innerHTML}</div>`;
						})
						.join("")}
		    `;
			});
	},
	wachtwoordVeldNawerk: function () {
		const o = document.getElementById("ontsleutel");
		o.value = "";
		o.focus();
	},

	willekeurigeGradientHoekrijen() {
		document.querySelectorAll(".form-rij + .form-rij").forEach((rij) => {
			const hoek = Math.floor(Math.random() * 360);
			rij.style.background = `linear-gradient(${hoek}deg, rgba(213, 189, 180, 0.44), rgba(180, 147, 147, 0.47))`;
		});
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
	toonActievelden: function () {
		if (window.innerWidth > 600) {
			var actieVelden = document.getElementsByClassName("actieveld");

			for (var i = actieVelden.length - 1; i >= 0; i--) {
				actieVelden[i].style.display = "block";
			}
		} else {
			var mobKnoppen = document.getElementsByClassName("mob-toon");
			for (var i = mobKnoppen.length - 1; i >= 0; i--) {
				mobKnoppen[i].style.display = "inline";
			}
		}
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
				.querySelector(".form-rij + .form-rij")
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
