const staat = {
	ontsleuteld: false,
	wachtwoord: null,
};

function toonWaarschuwingIndienNietEerderBezocht() {
	const heeftEerderBezocht =
		localStorage.getItem("vw-crm-eerder-bezocht") === "ja";
	if (!heeftEerderBezocht) {
		alert(
			"Je bezoekt nu het NIEUWE crm. Hier werkt Sjerp. Ga voor het huidige CRM naar https://vloerwerk.org/CRM-oud"
		);
		localStorage.setItem("vw-crm-eerder-bezocht", "ja");
	}
}
toonWaarschuwingIndienNietEerderBezocht();

var acties = {
	updateLaatsGezien() {
		document
			.querySelector(".form-tabel")
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
				document.querySelector(".form-tabel").appendChild(cloneRij);
				window.location.hash = cloneRij.id;
				document.getElementById("voeg-rij-toe").removeAttribute("disabled");
			});
	},
	selectieFilterChange: function () {
		$(".selectie-filter").on("change", function () {
			if (!this.value) return;
			const stapelFiltersB = stapelFilters();
			const dezeSelect = this.parentNode;
			const filterOp = this.value.toLowerCase();
			const rijenTeFilterenH = Array.from(
				document.querySelectorAll(".form-rij + .form-rij")
			);

			// als niet stapelen als display none eraf
			if (!stapelFiltersB) {
				rijenTeFilterenH.forEach((rij) => rij.removeAttribute("style"));
			}

			// als wel stapelen alleen verder met zichtbare
			const rijenTeFilteren = !stapelFiltersB
				? rijenTeFilterenH
				: rijenTeFilterenH.filter((rij) => {
						return rij.hasAttribute("style")
							? rij.getAttribute("style").includes("none")
							: true;
				  });
			const splitsZoekVeld = dezeSelect.hasAttribute("data-split");
			rijenTeFilteren.forEach((rij) => {
				const relevanteValue = rij
					.querySelector(`[data-naam='${this.getAttribute("data-filter")}']`)
					.value.toLowerCase();

				const gevonden = splitsZoekVeld
					? relevanteValue.split(" ").includes(filterOp)
					: relevanteValue.includes(filterOp);

				if (!gevonden) {
					rij.style.display = "none";
				}
			});
		});
	},
	selectieOngedaan: function () {
		$(".selectie-ongedaan").on("click", function (e) {
			e.preventDefault();
			Array.from(
				document.querySelectorAll(".form-rij + .form-rij")
			).forEach((rij) => rij.removeAttribute("style"));
		});
	},
	toonKolommen: function () {
		$("form .toon").on("change", function () {
			var id = this.id.replace("check-", "");
			var isChecked = $("#" + this.id + ":checked").length;
			if (isChecked) {
				$(this)
					.closest("form")
					.find(".cel-" + id)
					.show();
			} else {
				$(this)
					.closest("form")
					.find(".cel-" + id)
					.hide();
			}
		});
	},
	alertMailLijst: function () {
		this.alertGeneriek("email", ",");
	},
	alertTelLijst: function () {
		this.alertGeneriek("telefoon", ",");
	},
	alertGeneriek: function (type, lijm) {
		lijm = (lijm || ";") + "\t";

		$(".lijst-" + type).on("click", function (e) {
			var ookNamen = lijstOokNamen();
			var blokTel;
			//if (ookNamen) lijm = "<br>";
			e.preventDefault();
			var res = $(".form-rij")
				.filter(":visible")
				.find("[data-naam='" + type + "']")
				.map(function () {
					console.log(this.value);

					if (this.value && this.value !== "NEP@HEBBENWENIET.NL") {
						if (ookNamen) {
							if (type === "telefoon") {
								return dezeRijNaam(this) + ": " + this.value + "<br>";
							} else {
								return dezeRijNaam(this) + " &lt;" + this.value + "&gt; ";
							}
						} else {
							return this.value;
						}
					} else {
						communiceer("Niets gevonden?");
					}
				})
				.get();

			communiceer(res.join(lijm));

			/*			var p = document.getElementById('printer');
			var pp = p.getElementsByTagName('p')[0];
			//pp.innerHTML = res.join(lijm);

			var t = [];
			var htmlProd = '';
			for (var i = 0; i <= res.length; i++) {
				t.push(res[i]);
				t.join(lijm)
			}*/

			//en laatste beetje.
			//blokTel = Math.ceil(i/20) * 20;
			//			htmlProd += "<span class='alert-blok' data-teller='"+blokTel+"'>"+t.join(lijm)+"</span>";
			//htmlProd += "<span class='alert-blok' >"+t.join(lijm)+"</span>";
			//pp.innerHTML = htmlProd;

			//p.style.display = "block";
		});
	},

	ongedaanMaken: function () {
		$(".ongedaan").on("click", function (e) {
			e.preventDefault();
			if (confirm("Alle wijzigingen in dit scherm wissen?")) {
				location.href = document.body.getAttribute("data-base-url");
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
					`[data-naam='${filtert}']`
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

				selectElement.innerHTML = `
						<option value=''>${filtert}</option>
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

var form = {
	ontsleutel: function () {
		document
			.getElementById("ontsleutel")
			.addEventListener("keyup", function (e) {
				if (e.key.toLowerCase() === "enter") {
					e.preventDefault();
					$("button.ontsleutel").click();
				}
			});
		$("button.ontsleutel").on("click", function (e) {
			e.preventDefault();

			var sleutel = $("#ontsleutel").val();

			if (!sleutel) {
				communiceer("vul wat in");
				return;
			}

			staat.wachtwoord = sleutel;
			maakSleutelEnOntsleutel(sleutel)
				.then(() => {
					document
						.getElementById("grote-tabel-formulier")
						.classList.add("ontsleuteld");
					document.getElementById("sleutelaars").classList.add("ontsleuteld");
					staat.ontsleuteld = true;
					initActies();
				})
				.catch((e) => {
					communiceer(`fout in het ontsleutelen ${e}`);
					throw e;
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
					try {
						communiceer(`En dat is een 🥁🥁🥁 fout ${e.status}!
						De server zegt: 
						${e.data}`);
					} catch (error) {
						alert(
							"er ging iets fout, ergens, en bij het lezen van de fout ging iets fout, of de fout is niet begrepen."
						);
						console.error(error);
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
