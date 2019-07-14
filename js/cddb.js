/*
Github Username - AverageDragon
6/2/2019
The javascript for the databases in the cEDH Decklist Database.
*/
(function() {
  "use strict";

  const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets/1NYZ2g0ETfGulhPKYAKrKTPjviaLERKuvyKyk9oizV8Q/values/";
  const PARAMS = "!A2:K?key=AIzaSyCy2pE5znDZ9uDdpSgYb2Q992r0YOIPuIw";
  let database;

  window.addEventListener("load", init);

  /**
  * @description {Initializes the code and adds event listeners}
  */
  function init() {
    loadDatabase();
  }

  /** Gets the table from the API in order to display it on the webpage. */
  function loadDatabase() {
    let url = BASE_URL + qs(".active").id + PARAMS;

    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(populateDatabase)
      .catch(printError);
  }

  /**
   * Uses the response to populate the table
   * @param {object} response - The response from the API
   */
  function populateDatabase(response) {
    id("searchtext").addEventListener("input", updateDatabase);
    id("searchcurators").addEventListener("input", updateDatabase);

    id("hasPrimer").addEventListener("click", toggle);
    id("hasDiscord").addEventListener("click", toggle);

    let temp = [];
    let narrowedResponse = response.values;
    for (let i in narrowedResponse) {
      let entry = narrowedResponse[i];
      let row = [];
      row.primer = entry[0].trim().split(", ");
      row.list = entry[3].trim().split(", ");
      row.strategy = entry[1];
      row.deckname = entry[2];
      row.commander = entry[4];
      row.description = entry[5];
      row.colors = entry[6].replace(" ", "").replace(",", "");
      row.discord = entry[7].trim().split(", ");
      row.curators = entry[8].trim().split(", ");
      row.date = entry[9].trim().split(" ")[0];
      temp.push(row);
    }
    database = temp;
    updateDatabase();
  }

  function toggle() {
    let obj = this;
    if (obj.classList.contains("active")) {
      obj.classList.remove("active");
    } else {
      obj.classList.add("active");
    }
    updateDatabase();
  }

  /** Refetches the database according to the search.
  * @param {object} this - The button which was clicked
  */
  function activateSort() {
  }

  /** Uses the search parameters and updates the database.
  */
  function updateDatabase() {
    id("entries").innerHTML = "";
    let search = id("searchtext").value.trim().toLowerCase();
    let cur = id("searchcurators").value.trim().toLowerCase();
    let priObj = id("hasPrimer").classList.contains("active");
    let discObj = id("hasDiscord").classList.contains("active");

    for (let i in database) {
      let entry = database[i];
      let searched = ((entry.commander.toLowerCase().includes(search)
          || entry.deckname.toLowerCase().includes(search))
          || entry.description.toLowerCase().includes(search));

      let hasPrimer = (entry.primer.includes("Y")) || !priObj;
      let hasDiscord = (entry.discord != "NA") || !discObj;
      let matches = false;
      for (let i in entry.curators) {
        if (entry.curators[i].toLowerCase().trim().includes(cur)) {
          matches = true;
        }
      }
      if (hasPrimer && hasDiscord && searched && matches) {
        addRow(entry, i);
      }
    }
  }

  /* Adds a single row to the database */
  function addRow(entry, count) {
    let id = "ie" + count;
    let entryRow = document.createElement("tr");
    entryRow.id = "e" + count;
    entryRow.dataset.toggle = "collapse";
    entryRow.dataset.target = "#" + id;
    entryRow.classList.add("clickable");
    entryRow.classList.add("entry");
    document.getElementById("entries").appendChild(entryRow);

    let colors = document.createElement("td");
    colors.classList = "colors";
    let colorSplit = entry.colors.toLowerCase().split("");
    let colorArray = ["w", "u", "b", "r", "g"];
    for (let i = 0; i < 5; i++) {
      let letter = colorArray[i];
      let image = document.createElement("img");
      if (!colorSplit.includes(letter)) {
        letter = "d";
      }
      image.src= "img/mana/" + letter + ".png";
      image.alt = letter;
      colors.appendChild(image);
    }
    entryRow.appendChild(colors);

    entryRow.appendChild(addBasicData(entry, "strategy"));
    entryRow.appendChild(addBasicData(entry, "commander"));
    entryRow.appendChild(addBasicData(entry, "deckname"));

    let infoRow = document.createElement("tr");
    infoRow.classList = "info table-secondary";
    document.getElementById("entries").appendChild(infoRow);

    let td = document.createElement("td");
    td.colSpan = "4";
    infoRow.appendChild(td);

    let sub = document.createElement("div");
    sub.id = id;
    sub.classList = "collapse sub";
    td.appendChild(sub);

    let upper = document.createElement("div");
    upper.classList = "upper";
    sub.appendChild(upper);
    upper.appendChild(addDescription(entry));
    upper.appendChild(addLists(entry));
    upper.appendChild(addDiscord(entry));

    sub.appendChild(document.createElement("hr"));
    let curators = document.createElement("p");
    curators.innerText = entry.curators.join(", ");
    curators.classList = "curators";

    let date = document.createElement("p");
    date.innerText = "Date Added: " + entry.date;
    date.classList = "date";

    let holder = document.createElement("div");
    holder.appendChild(date);
    holder.appendChild(curators);
    holder.classList = "holder";
    sub.appendChild(holder);
  }

  function addBasicData(entry, data) {
    let adding = document.createElement("td");
    adding.classList = data;
    if (data == "deckname") {
      let image = document.createElement("img");
      image.src = "img/primer.png";
      image.classList.add("primerImage");
      if (entry.primer.includes("Y")) {
        image.alt = "primer";
      } else {
        image.classList.add("darkened");
        image.alt = "no primer";
      }
      adding.appendChild(image);

      let dimage = document.createElement("img");
      dimage.src = "img/hasdiscord.png";
      dimage.classList = "discordImage";
      if (!entry.discord.includes("NA")) {
        dimage.alt = "discord";
      } else {
        dimage.classList.add("darkened");
        image.alt = "no discord";
      }
      adding.appendChild(dimage);

      let text = document.createElement("div");
      text.innerText = entry[data];
      adding.appendChild(text);
    } else {
      adding.innerText = entry[data];
    }
    return adding;
  }

  function addDescription(entry) {
    let description = document.createElement("div");
    description.classList = "description";
    let name = document.createElement("h4");
    name.innerText = entry.deckname;
    description.appendChild(name);
    description.appendChild(document.createElement("hr"));
    let desc = document.createElement("p");
    desc.innerText = entry.description;
    description.appendChild(desc);
    return description;
  }

  function addLists(entry) {
    let decklists = document.createElement("div");
    decklists.classList = "decklists";

    let lists = entry.list
    for (let i in lists) {
      let list = lists[i].trim();
      let link = document.createElement("a");
      link.href = list;
      link.target = "_blank";
      if (i == 1) {
        let sep = document.createElement("hr");
        decklists.appendChild(sep);
      }
      if (i == 0) {
        link.classList = "suggested";
        link.innerText = "Suggested Decklist";
      } else {
        link.classList = "alt";
        link.innerText = "Alternate List";
      }
      let primers = entry.primer;
      let linkDiv = document.createElement("div");
      linkDiv.classList = "linkDiv";
      let primerImg = document.createElement("img");
      primerImg.src = "img/primer.png";
      if (primers[i] === "Y") {
        primerImg.alt = "Primer";
      } else {
        primerImg.classList.add("darkened");
        primerImg.alt = "No primer";
      }
      linkDiv.appendChild(primerImg);
      linkDiv.appendChild(link);
      decklists.appendChild(linkDiv);
    }

    return decklists;
  }

  function addDiscord(entry) {
    let discord = document.createElement("div");
    discord.classList = "discord";
    let icon = document.createElement("img");
    if (entry.discord == "NA") {
      icon.src = "img/discord.png";
      icon.classList.add("darkened");
      icon.alt = "Missing Discord Server Image";
      let link = document.createElement("a");
      link.classList = "suggested";
      let text = document.createElement("p");
      text.innerText = "Discord Server";
      text.classList = "missing";
      link.appendChild(icon);
      link.appendChild(text);
      discord.appendChild(link);
    } else {
      let servers = entry.discord;
      for (let i in servers) {
        let single = servers[i].trim();
        let link = document.createElement("a");
        link.href = single;
        link.target = "_blank";
        if (i == 1) {
          let sep = document.createElement("hr");
          discord.appendChild(sep);
        }
        if (i == 0) {
          icon.src = "img/discord.png";
          icon.alt = "Discord Server Icon";
          let text = document.createElement("p");
          text.innerText = "Discord Server";
          link.appendChild(icon);
          link.appendChild(text);
          discord.appendChild(link);
        } else {
          let text = document.createElement("p");
          text.innerText = "Alternate";
          link.appendChild(text);
          discord.appendChild(link);
        }
      }
    }
    return discord;
  }

  /** Prints and error's content to the webpage
  * @param {string} info - the error information that should be passed
  */
  function printError(info) {
    id("entries").innerHTML = "";
    let error = document.createElement("td");
    error.innerText = "Sorry, the request to our database failed with the error:\n"
                      + info;
    error.colSpan = "4";
    let row = document.createElement("tr");
    row.appendChild(error);
    id("entries").appendChild(row);
    console.error(info);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
  * Returns the first element that matches the given CSS selector.
  * @param {string} query - CSS query selector.
  * @returns {object} The first DOM object matching the query.
  */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      console.log(response);
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
