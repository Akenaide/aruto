const cardStats = new Map();

chrome.devtools.network.onRequestFinished.addListener((request) => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes("api.altered.gg/cards") && body) {
        const bodyJSON = JSON.parse(body);
        if (bodyJSON["hydra:member"]) {
          expendCardCollection(bodyJSON["hydra:member"]);
          updateUI();
        }
      }
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("expend-collection-button")
    .addEventListener("click", mergeCardCollection);
});

function mergeCardCollection() {
  let stringCollection = document.getElementById("collection-input").value;
  for (const line of stringCollection.split("\n")) {
    info = line.split(" ");
    let inMyCollection = info[0];
    let reference = info[1];

    if (reference === undefined) {
      continue;
    }
    if (cardStats.has(reference)) {
      cardStats.get(reference).inMyCollection += parseInt(inMyCollection);
    } else {
      cardStats.set(reference, {
        inMyCollection: inMyCollection,
        reference: reference,
      });
    }
  }
  updateUI();
}

function expendCardCollection(newCardCollection) {
  for (const card of newCardCollection) {
    cardStats.set(card["reference"], cardStats.get(card["reference"]) || {});
    if ("inMyCollection" in card) {
      cardStats.get(card["reference"]).inMyCollection = card["inMyCollection"];
    } else {
      cardStats.get(card["reference"]).name = card["name"];
      cardStats.get(card["reference"]).imagePath = card["imagePath"];
      cardStats.get(card["reference"]).id = card["@id"];
      cardStats.get(card["reference"]).reference = card["reference"];
    }
  }
}

function updateUI() {
  const collection = document.getElementById("collection");
  collection.value = "";
  cardStats.forEach((card) => {
    collection.value += `${card.inMyCollection} ${card.reference}\n`;
  });
}
