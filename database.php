<?php
/* Needs to be hosted somewhere, until then.... */
ini_set("allow_url_fopen", 1);

if (isset($_GET["list"])) {
  $sheet = $_GET["list"];

  if (($sheet == "primary" || $sheet == "fringe") || $sheet == "submissions") {
    $file = file_get_contents("https://sheets.googleapis.com/v4/spreadsheets/1NYZ2g0ETfGulhPKYAKrKTPjviaLERKuvyKyk9oizV8Q/values/"
    . $sheet . "!A2:I?key=AIzaSyCy2pE5znDZ9uDdpSgYb2Q992r0YOIPuIw");

    $workable = json_decode($file)->values;
    $entryArray = array();
    foreach ($workable as $entry) {
      $newEntry = array();
      $newEntry["primer"] = explode(", ", trim($entry[0]));
      $newEntry["list"] = explode(", ", trim($entry[3]));
      $newEntry["strategy"] = $entry[1];
      $newEntry["deckname"] = $entry[2];
      $newEntry["commander"] = $entry[4];
      $newEntry["description"] = $entry[5];
      $newEntry["colors"] = $entry[6];
      $newEntry["discord"] = explode(", ", trim($entry[7]));
      $newEntry["curators"] = explode(", ", trim($entry[8]));
      array_push($entryArray, $newEntry);
    }
    header('Content-Type: application/json');
    echo json_encode($entryArray);
  } else {
    handleError400("$sheet is not a valid database tab");
  }
}

/** Handles 400 errors by returning a helpful message and setting error header.
  * @param {string} $error - The message that you want to be attached to the error.
  */
function handleError400($error) {
  header("HTTP/1.1 400 Invalid Request");
  header("Content-type: text/plain");
  echo "HTTP/1.1 400 Invalid Request: " . $error;
}
?>
