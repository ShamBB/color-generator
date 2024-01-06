let hexArray = [];
const favcolorEl = document.getElementById("favcolor");
const schemeColor = document.getElementById("scheme-color");
const loaderEl = document.getElementById("loader");
const listColor = document.getElementById("list-color");

getColorList(favcolorEl.value, schemeColor.value);

document
  .getElementById("btn-get-scheme")
  .addEventListener("click", function () {
    craeteLoader();
    getColorList(favcolorEl.value, schemeColor.value);
  });

function renderColor() {
  let colorHtml = "";
  hexArray.map(function (arrayEl) {
    const divEl = document.createElement("div");
    divEl.classList.add("color-bar");
    divEl.dataset.codeColor = arrayEl.hex.value;
    divEl.style.backgroundColor = arrayEl.hex.value;

    colorHtml += `
          <div class="row">
            ${divEl.outerHTML}
            <p class="color-code">${arrayEl.hex.value}</p>
          </div>`;
  });

  listColor.innerHTML = colorHtml;
}

function getColorList(hexColor, mode) {
  const params = new URLSearchParams({
    hex: hexColor,
    mode: mode,
    count: "5",
  });

  const url = `https://www.thecolorapi.com/scheme?${params.toString()}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      hexArray = data.colors;
      renderColor();
      loaderEl.style.display = "none";
      removeLoadBackdrop();
      mainFunctionCopyClipboard();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      loaderEl.style.display = "none";
      removeLoadBackdrop();
    });
}

function craeteLoader() {
  const loader = document.createElement("div");
  loader.classList.add("loader");
  loader.id = "loader";
  listColor.classList.add("show-after");
  listColor.appendChild(loader);
}

function removeLoadBackdrop() {
  listColor.classList.remove("show-after");
}

function mainFunctionCopyClipboard() {
  document.querySelectorAll(".color-bar").forEach(function (element) {
    handleCopyClipboard(element);
    handleAfterCopyClipboard(element);
  });
}

function handleCopyClipboard(element) {
  element.addEventListener("click", (event) => {
    const codeColor = event.currentTarget.dataset.codeColor;
    const classList = event.currentTarget.classList;

    navigator.clipboard
      .writeText(codeColor)
      .then(() => {
        classList.add("color-bar-transform");
      })
      .catch((err) => {
        console.error("Failed to copy code color to clipboard", err);
      });
  });
}

function handleAfterCopyClipboard(element) {
  element.addEventListener("mouseout", function (e) {
    e.currentTarget.classList.remove("color-bar-transform");
  });
}
