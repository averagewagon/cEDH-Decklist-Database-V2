/*
Github Username - AverageDragon
6/2/2019
The javascript for the databases in the cEDH Decklist Database.
*/
(function() {
  "use strict";

  const FIRST_DB = "https://spreadsheets.google.com/feeds/cells/1NYZ2g0ETfGulhPKYAKrKTPjviaLERKuvyKyk9oizV8Q/1/public/full?alt=json";
  const SECOND_DB = "https://spreadsheets.google.com/feeds/cells/1NYZ2g0ETfGulhPKYAKrKTPjviaLERKuvyKyk9oizV8Q/2/public/full?alt=json";

  let database;

  window.addEventListener("load", init);

  /**
  * @description {Initializes the code and adds event listeners}
  */
  function init() {
  if (window.location.href.indexOf("primary") > -1) {
    id("primary").classList.add("active");
  } else if (window.location.href.indexOf("fringe") > -1) {
    id("fringe").classList.add("active");
  } else if (window.location.href.indexOf("submissions") > -1) {
    id("submissions").classList.add("active");
  } else if (window.location.href.indexOf("resources") > -1) {
    id("resources").classList.add("active");
  } else {
    window.location.href = "primary.html";
  }

  id("primary").addEventListener("click", () => {
    window.location.href = "primary.html";
  });
  id("fringe").addEventListener("click", () => {
    window.location.href = "fringe.html";
  });
  id("submissions").addEventListener("click", () => {
    window.location.href = "submissions.html";
  });
  id("resources").addEventListener("click", () => {
    window.location.href = "resources.html";
  });

  loadDatabase();
  }

  /** Gets the table from the API in order to display it on the webpage. */
  function loadDatabase() {
    let url = "";
    if (qs(".active").id === "primary") {
      url = FIRST_DB;
    } else if (qs(".active").id === "primary") {
      url = SECOND_DB;
    } else {
      console.error("This isn't a database page, you dolt");
    }

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
    // Set up event listeners, as they should wait for the API to load
    // Submit on enter
    // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
    id("searchtext").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search").click();
      }
    });
    id("search").addEventListener("click", updateDatabase);
    let sorts = qsa("thead th button");
    sorts.forEach(function(button) {
      button.addEventListener("click", activateSearch);
    });

    formDatabase(response);
    updateDatabase();
  }

  /**
   * Uses the response to clean the json
   * @param {object} response - The response from the API
   */
  function formDatabase(response) {
    let builder = []
    let objectCount = 0;
    let rowcount = 0;

    for (let i in response.feed.entry) {
      if (i >= 9) {
        if (!builder[objectCount]) {
          builder[objectCount] = {};
        }
        let objectValue = response.feed.entry[i].content["$t"];
        if (rowcount === 0) {
          builder[objectCount].primer = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 1) {
          builder[objectCount].strategy = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 2) {
          builder[objectCount].deckname = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 3) {
          builder[objectCount].list = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 4) {
          builder[objectCount].commander = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 5) {
          builder[objectCount].description = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 6) {
          builder[objectCount].colors = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 7) {
          builder[objectCount].discord = objectValue;
          rowcount = rowcount + 1;
        } else if (rowcount === 8) {
          builder[objectCount].curators = objectValue;
          rowcount = 0;
          objectCount = objectCount + 1;
        }
      }
    }

    database = builder;
  }

  /** Refetches the database according to the search.
  * @param {object} this - The button which was clicked
  */
  function activateSearch() {
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
    let search = id("searchtext").value.trim();

    for (let i in database) {
      let entry = database[i];

      if ((((entry.commander.includes(search)
          || entry.curators.includes(search))
          || entry.deckname.includes(search))
          || entry.description.includes(search))
          || entry.strategy.includes(search)) {
          addRow(entry, i);
      }
    }
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
    let colorSplit = entry.colors.split("");
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

    let strategy = document.createElement("td");
    strategy.classList = "strategy";
    strategy.innerText = entry.strategy;
    entryRow.appendChild(strategy);

    let commander = document.createElement("td");
    commander.classList = "commander";
    commander.innerText = entry.commander;
    entryRow.appendChild(commander);

    let deckname = document.createElement("td");
    deckname.classList = "deckname";
    deckname.innerText = entry.deckname;
    entryRow.appendChild(deckname);

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

    let upper = document.createElement("upper");
    sub.appendChild(upper);

    let description = document.createElement("div");
    description.classList = "description";
    upper.appendChild(description);
    let name = document.createElement("h4");
    name.innerText = entry.deckname;
    description.appendChild(name);
    description.appendChild(document.createElement("hr"));
    let desc = document.createElement("p");
    desc.innerText = entry.description;
    description.appendChild(desc);

    let decklists = document.createElement("div");
    decklists.classList = "decklists";
    upper.appendChild(decklists);

    let lists = entry.list.split(",");
    for (let i in lists) {
      let list = lists[i];
      let link = document.createElement("a");
      link.href = list;
      link.target = "_blank";
      if (i === 0) {
        link.classList = "suggested";
        link.innerText = "Suggested Decklist";
      } else if (i === 1) {
        let sep = document.createElement("hr");
        decklists.appendChild(sep);
        link.classList = "alt";
        link.innerText = "Alternate List";
      } else {
        link.classList = "alt";
        link.innerText = "Alternate List";
      }
      if (entry.primer === "Y") {
        link.innerText = link.innerText + " [P]"
      }
      decklists.appendChild(link);
    }
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
