// Fonction pour créer les selects
function createCustomSelectFilter(data, type, placeholder) {
  let filter = [];
  if (type === "appliances") {
    filter = [
      ...new Map(
        data.map((recipe) => [recipe.appliance.toLowerCase(), recipe.appliance])
      ),
    ].sort();
  } else if (type === "ustensils") {
    filter = [
      ...new Map(
        data.flatMap((recipe) =>
          recipe.ustensils.map((ustensil) => [
            ustensil.toLowerCase().replace(/s$/, ""),
            ustensil,
          ])
        )
      ),
    ].sort();
  } else if (type === "ingredients") {
    filter = [
      ...new Map(
        data.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) => [
            ingredient.ingredient.toLowerCase().replace(/s$/, ""),
            ingredient.ingredient,
          ])
        )
      ),
    ].sort();
  } else {
    throw new Error(`Type ${type} unknown`);
  }

  return `
    <div class="selectSection__groupSelect__selectHeader__selectContainer" data-type="${type}">
      <div class="selectSection__groupSelect__selectHeader">
        <span class="selectSection__groupSelect__selectHeader__label">${placeholder}</span>
        <i class="fa-solid fa-angle-down"></i>
      </div>
      <div class="selectSection__groupSelect__selectHeader__selectContainer__selectBody hidden">
        <input 
          type="text" 
          aria-label="${placeholder}" 
        />
        <ul class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer">
          ${filter
            .map(
              ([lowercase, original]) => `
                <li class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption" data-value="${lowercase}">
                  ${original}
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
      <div class="selected-items" data-type="${type}"></div>
    </div>
  `;
}

function bindSelect() {
  // Écoute des clics sur les options de toutes les listes
  document.addEventListener("click", (event) => {
    const option = event.target.closest(
      ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption"
    );

    // Vérifiez si une option a été cliquée
    if (option) {
      const selectedItemsDiv = option
        .closest(".selectSection__groupSelect__selectHeader__selectContainer")
        .querySelector(".selected-items");

      // Ajouter l'élément sélectionné
      selectedItemsDiv.insertAdjacentHTML(
        "beforeend",
        `
        <div class="selectSection__groupSelect__selectHeader__selectedItem">
          ${option.textContent}
          <button class="selectSection__groupSelect__selectHeader__selectedItem__remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `
      );

      // Ajouter un gestionnaire d'événements pour le bouton de suppression
      selectedItemsDiv
        .querySelector(
          ".selectSection__groupSelect__selectHeader__selectedItem__remove"
        )
        .addEventListener("click", () => {
          selectedItemsDiv
            .querySelector(
              ".selectSection__groupSelect__selectHeader__selectedItem__remove"
            )
            .parentElement.remove();
        });
    }
  });
}

function initializeSelectSearch(container) {
  container.querySelector("input").addEventListener("input", () => {
    // Filtrer les options
    Array.from(container.querySelectorAll("li")).map((option) => {
      option.style.display = option.textContent
        .toLowerCase()
        .includes(container.querySelector("input").value.trim())
        ? ""
        : "none";
      return option;
    });
  });
}

function selectEvents() {
  document
    .querySelectorAll(
      ".selectSection__groupSelect__selectHeader__selectContainer"
    )
    .forEach((container) => {
      const header = container.querySelector(
        ".selectSection__groupSelect__selectHeader"
      );
      const body = container.querySelector(
        ".selectSection__groupSelect__selectHeader__selectContainer__selectBody"
      );
      const icon = header.querySelector("i");

      // Gérer l'ouverture/fermeture lors du clic sur le select
      header.addEventListener("click", () => {
        body.classList.toggle("hidden");
        // Gère les icônes
        body.classList.contains("hidden")
          ? (icon.classList.remove("fa-angle-up"),
            icon.classList.add("fa-angle-down"))
          : (icon.classList.remove("fa-angle-down"),
            icon.classList.add("fa-angle-up"));
      });

      initializeSelectSearch(container);
    });
}

function generateSelects(recipes) {
  const filters = [
    {
      key: "ingredients",
      label: "Ingrédients",
      containerId: "ingredientsSelectContainer",
    },
    {
      key: "appliances",
      label: "Appareils",
      containerId: "appliancesSelectContainer",
    },
    {
      key: "ustensils",
      label: "Ustensiles",
      containerId: "ustensilSelectContainer",
    },
  ];

  filters.forEach((filter) => {
    const selectHTML = createCustomSelectFilter(
      recipes,
      filter.key,
      filter.label
    );
    document.getElementById(filter.containerId).innerHTML = selectHTML;
  });

  // Configurer les événements pour les selects
  selectEvents();
}
