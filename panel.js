const cardStats = new Map();
chrome.devtools.network.onRequestFinished.addListener((request) => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes("api.altered.gg/cards") && body) {
        const bodyJSON = JSON.parse(body);
        for (const card of bodyJSON["hydra:member"]) {
          cardStats.set(card["@id"], cardStats.get(card["@id"]) || {});
          if ("inMyCollection" in card) {
            cardStats.get(card["@id"]).inMyCollection = card["inMyCollection"];
          } else {
            cardStats.get(card["@id"]).name = card["name"];
            cardStats.get(card["@id"]).imagePath = card["imagePath"];
            cardStats.get(card["@id"]).id = card["@id"];
          }
        }
        updateUI();
      }
    }
  });
});

function updateUI() {
  const contentPanel = document.querySelector(".content-panel");
  contentPanel.innerHTML = "";
  cardStats.forEach((card) => {
    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    cardInfo.innerHTML = `<span class="card-name">${card.name}</span><span class="card-id">${card.id}</span> | <span class="card-in-my-collection">${card.inMyCollection}</span>`;
    contentPanel.appendChild(cardInfo);
  });
}
