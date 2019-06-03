/*
Github Username - AverageDragon
6/2/2019
The javascript for the databases in the cEDH Decklist Database.
*/
(function() {
  "use strict";

  const URL_BASE = "database.php";

  window.addEventListener("load", init);

  /**
  * @description {Initializes the code and adds event listeners}
  */
  function init() {
    let sorts = qsa("thead th button");
    sorts.forEach(function(button) {
      button.addEventListener("click", activateSearch);
    });
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

    loadDatabase();
  }

  /** Gets the table from the API in order to display it on the webpage. */
  function loadDatabase() {
    let sort = qs(".chosensort").id;
    id("entries").innerHTML = "";
    let url = URL_BASE;

    /*
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(populateApps)
      .catch(printError);*/
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
