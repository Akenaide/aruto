function addButton() {
  let top_bar = document.querySelector(
    "div.flex.items-center.justify-center.gap-2",
  );
  button = document.createElement("button");
  top_bar.appendChild(button);

  button.innerHTML = "🔥";
  button.classList.add("bg-red-500", "text-white", "rounded-full");
  button.addEventListener("click", function () {
    fetchAll();
  });
}
function fetchAll() {
  const links = document.querySelectorAll("li a.ease-out");
  links.forEach((link) => {
    if (link.textContent === "1") {
      link.click();
    }
  });
  next = document.querySelector("[data-testid='next-page']");
  if (next) {
    next.click();
    setTimeout(fetchAll, 550);
  }
}
addButton();
