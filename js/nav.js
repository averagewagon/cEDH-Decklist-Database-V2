/*
Github Username - AverageDragon
6/2/2019
The javascript for the navbar in the cEDH Decklist Database.
*/
(function() {
  "use strict";

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
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }
})();
