// Deklaráljuk a változókat, amelyeket a későbbi függvényekben használni fogunk
let szam_gyakorisag = {};
let szam_egyutt_huzva = {};

// Fájlfeltöltés kezelése
function handleFile() {
  const fileInput = document.getElementById("csv-file");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const csvData = e.target.result;
      const rows = csvData.trim().split('\n');

      // Első sor az oszlopok címkéi, ne legyen benne a húzások között
      const dataRows = rows.slice(1);

      // Első 10 húzás adatainak tárolása
      const first10Draws = dataRows.slice(0, 10).map(row => row.split(';'));

      // Utolsó 10 húzás adatainak tárolása
      const last10Draws = dataRows.slice(-10).map(row => row.split(';'));

      dataRows.forEach(row => {
        const fields = row.split(';');
        const szamok = fields.slice(4).map(Number);

        // Számok gyakoriságának frissítése
        szamok.forEach(szam => {
          if (!szam_gyakorisag[szam]) {
            szam_gyakorisag[szam] = 1;
          } else {
            szam_gyakorisag[szam]++;
          }
        });

        // Együtt húzott számok gyakoriságának frissítése
        updateCombinations(szamok);
      });

      // Példa a leggyakoribb számok megtalálására
      const leggyakoribb_szamok = Object.entries(szam_gyakorisag)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(entry => entry[0]);

      // Példa a legritkább számok megtalálására
      const legritkabb_szamok = Object.entries(szam_gyakorisag)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 10)
        .map(entry => entry[0]);

      // Példa a leggyakrabban együtt húzott 5 szám megtalálására
      const leggyakoribb_egyutt_huzva = findMostCommonCombinations(5, 10);

      // Példa a legritkábban együtt húzott 5 szám megtalálására
      const legritkabb_egyutt_huzva = findLeastCommonCombinations(5, 10);

      // Megjelenítjük az eredményeket az oldalon
      displayStatistics(leggyakoribb_szamok, legritkabb_szamok);
      displayCombinations("Leggyakrabban együtt húzott 5 szám", leggyakoribb_egyutt_huzva, "most-common-combinations");
      displayCombinations("Legritkábban együtt húzott 5 szám", legritkabb_egyutt_huzva, "least-common-combinations");
      
      // Kiírjuk az első 10 és utolsó 10 húzás adatait
      displayDraws("Első 10 húzás", first10Draws, "first-10-draws");
      displayDraws("Utolsó 10 húzás", last10Draws, "last-10-draws");
    };

    // Feltöltési folyamat kezelése: mutassunk egy progressz sávot
    reader.onprogress = function(event) {
      if (event.lengthComputable) {
        const percentLoaded = (event.loaded / event.total) * 100;
        updateProgressBar(percentLoaded);
      }
    };

    reader.readAsText(file);
  } else {
    console.error("Nincs kiválasztva fájl.");
  }
}

// Számok együtt húzásának frissítése
function updateCombinations(szamok) {
  const szamok_sorted = szamok.sort((a, b) => a - b);
  const szamok_key = szamok_sorted.join(",");

  if (!szam_egyutt_huzva[szamok_key]) {
    szam_egyutt_huzva[szamok_key] = 1;
  } else {
    szam_egyutt_huzva[szamok_key]++;
  }
}

// Leggyakoribb együtt húzott számok megtalálása
function findMostCommonCombinations(count, limit) {
  return Object.entries(szam_egyutt_huzva)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0])
    .map(combo => combo.split(",").map(Number))
    .filter(combo => combo.length === count);
}

// Legritkább együtt húzott számok megtalálása
function findLeastCommonCombinations(count, limit) {
  return Object.entries(szam_egyutt_huzva)
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(entry => entry[0])
    .map(combo => combo.split(",").map(Number))
    .filter(combo => combo.length === count);
}

// Progressz sáv frissítése
function updateProgressBar(percent) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = percent + "%";
}

// Statisztikák megjelenítése az oldalon
function displayStatistics(leggyakoribb_szamok, legritkabb_szamok) {
  const numberFrequenciesList = document.getElementById("number-frequencies");
  const mostCommonNumbersList = document.getElementById("most-common-numbers");
  const leastCommonNumbersList = document.getElementById("least-common-numbers");

  numberFrequenciesList.innerHTML = "";
  mostCommonNumbersList.innerHTML = "";
  leastCommonNumbersList.innerHTML = "";

  // Számok gyakoriságának megjelenítése
  for (const szam in szam_gyakorisag) {
    const listItem = document.createElement("li");
    listItem.textContent = `Szám ${szam}: ${szam_gyakorisag[szam]} alkalommal húzva`;
    numberFrequenciesList.appendChild(listItem);
  }

  // Leggyakoribb számok megjelenítése
  leggyakoribb_szamok.forEach(szam => {
    const listItem = document.createElement("li");
    listItem.textContent = `Szám ${szam}: Leggyakrabban húzva`;
    mostCommonNumbersList.appendChild(listItem);
  });

  // Legritkább számok megjelenítése
  legritkabb_szamok.forEach(szam => {
    const listItem = document.createElement("li");
    listItem.textContent = `Szám ${szam}: Legritkábban húzva`;
    leastCommonNumbersList.appendChild(listItem);
  });
}

// Együtt húzott számok megjelenítése
function displayCombinations(title, combinations, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = `<h2>${title}</h2>`;

  combinations.forEach(combo => {
    const comboStr = combo.join(", ");
    const listItem = document.createElement("li");
    listItem.textContent = `Számok: ${comboStr}`;
    list.appendChild(listItem);
  });
}
