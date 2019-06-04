/*
Github Username - AverageDragon
6/2/2019
The javascript for the databases in the cEDH Decklist Database.
*/
(function() {
  "use strict";

  const BASE_URL = "database.php";
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
    let url = BASE_URL + "?list="+ qs(".active").id;

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
    let sorts = qsa("thead th button");
    sorts.forEach(function(button) {
      button.addEventListener("click", activateSort);
    });
    id("switches").addEventListener("click", updateDatabase);
    id("searchtext").addEventListener("input", updateDatabase);

    database = response;
    updateDatabase();
  }

  /** Refetches the database according to the search.
  * @param {object} this - The button which was clicked
  */
  function activateSort() {
    let sorts = qsa("thead th button");
    let choice = this.id;
    sorts.forEach(function(button) {
      let id = button.id;
      if (id === choice) {
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
        button.classList.add("chosensort");
      } else {
        button.classList.add("btn-primary");
        button.classList.remove("btn-secondary");
        button.classList.remove("chosensort");
      }
    });

    updateDatabase();
  }

  /** Uses the search parameters and updates the database.
  */
  function updateDatabase() {
    id("entries").innerHTML = "";
    let sort = qs(".chosensort").id;
    let search = id("searchtext").value.trim().toLowerCase();
    let priObj = !id("hasPrimer").checked;
    let discObj = !id("hasDiscord").checked;

    for (let i in database) {
      let entry = database[i];
      let searched = ((entry.commander.toLowerCase().includes(search)
          || entry.deckname.toLowerCase().includes(search))
          || entry.description.toLowerCase().includes(search));

      let hasPrimer = (entry.primer.includes("Y")) || !priObj;
      let hasDiscord = (entry.discord != "NA") || !discObj;
      if (hasPrimer &&  (hasDiscord && searched)) {
        addRow(entry, i);
      }
    }

    sortRows(sort);
  }

  function sortRows(sort) {

  }

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

    /*
    let colors = document.createElement("td");
    colors.classList = "colors";
    let colorSplit = entry.colors.toLowerCase().split("");
    for (let i = 0; i < 5; i++) {
      let letter = "blank";
      if (colorSplit[i]) {
        letter = colorSplit[i]
      }
      let image = document.createElement("img");
      image.src="img/mana/" + letter + ".png";
      image.alt = letter;
      colors.appendChild(image);
    }
    entryRow.appendChild(colors);
    */

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
    sub.appendChild(curators);
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
      if (primers[i] === "Y") {
        link.innerText = link.innerText + " [P]"
      }
      decklists.appendChild(link);
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
          link.appendChild(icon);
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
