const selectedTags = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

// Fonction pour gérer les selects
function manageSelectFilter(data, type, placeholder) {
  const typeMapping = {
    appliances: (recipe) => recipe.appliance.toLowerCase(),
    ustensils: (recipe) =>
      recipe.ustensils.map((ustensil) => ustensil.toLowerCase().trim()),
    ingredients: (recipe) =>
      recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase().trim()
      ),
  };

  if (!typeMapping[type]) {
    throw new Error(`Type ${type} unknown`);
  }

  const filter = [
    ...new Set(
      data.flatMap((recipe) =>
        Array.isArray(typeMapping[type](recipe))
          ? typeMapping[type](recipe)
          : [typeMapping[type](recipe)]
      )
    ),
  ]
    .sort()
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1));

  const container = document.querySelector(
    `.selectSection__group__header__container[data-type="${type}"]`
  );

  if (!container) {
    return `
      <div class="selectSection__group__header__container" data-type="${type}">
        <div class="selectSection__group__header">
          <span class="selectSection__group__header__label">${placeholder}</span>
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div class="selectSection__group__header__container__body selectSection__group__header__displayContainer">
          <input 
            class="selectSection__group__header__container__body__input"
            type="text" 
          />
          <i
              class="fa-solid fa-xmark fa-sm selectSection__group__header__container__body__input__crossBtn"
            ></i>
          <i
            class="fa-solid fa-magnifying-glass selectSection__group__header__container__body__input__magnifyingGlass"
          ></i>
          <ul class="selectSection__group__header__container__body__optionsContainer">
            ${filter
              .map(
                (option) => `
                  <li class="selectSection__group__header__container__body__optionsContainer__option" data-value="${option.toLowerCase()}">
                    ${option}
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
        <div class="selected-items" data-type="${type}"></div>
      </div>
    `;
  } else {
    const optionsContainer = container.querySelector(
      ".selectSection__group__header__container__body__optionsContainer"
    );

    const optionsHTML = filter
      .map((option) => {
        return `
          <li class="selectSection__group__header__container__body__optionsContainer__option ${
            selectedTags[type].has(option.toLowerCase())
              ? "selectSection__group__header__container__body__optionsContainer__selected"
              : ""
          }" data-value="${option.toLowerCase()}">
            ${option}
          </li>
        `;
      })
      .join("");

    optionsContainer.innerHTML = optionsHTML;
  }
}

// Fonction pour recalculer les options disponibles
function updateAvailableOptions(recipes) {
  const availableIngredients = new Set();
  const availableAppliances = new Set();
  const availableUstensils = new Set();

  recipes.map((recipe) => {
    recipe.ingredients.map((ingredient) => {
      availableIngredients.add(ingredient.ingredient.toLowerCase());
    });
    availableAppliances.add(recipe.appliance.toLowerCase());
    recipe.ustensils.map((ustensil) => {
      availableUstensils.add(ustensil.toLowerCase());
    });
  });

  // Mise à jour des options dans chaque champ
  manageSelectFilter(recipes, "ingredients", "Ingrédients");
  manageSelectFilter(recipes, "appliances", "Appareils");
  manageSelectFilter(recipes, "ustensils", "Ustensiles");
}

// Fonction pour initialiser la recherche dans les selects
function initializeSelectSearch(container) {
  const input = container.querySelector("input");
  const crossIcon = container.querySelector(".fa-xmark");

  // Masquer l'icône par défaut
  crossIcon.style.display = "none";

  const updateDisplay = () => {
    const searchTerm = input.value.trim().toLowerCase();

    // Afficher ou masquer l'icône en fonction du contenu de l'input
    crossIcon.style.display = searchTerm ? "inline" : "none";

    // Filtrer les options
    Array.from(container.querySelectorAll("li")).map((option) => {
      option.style.display = option.textContent
        .toLowerCase()
        .includes(searchTerm)
        ? ""
        : "none";
    });
  };

  // Gestion de la saisie dans l'input
  input.addEventListener("input", updateDisplay);

  // Gestion du clic sur l'icône de croix
  crossIcon.addEventListener("click", () => {
    input.value = "";
    crossIcon.style.display = "none";

    // Réafficher toutes les options
    Array.from(container.querySelectorAll("li")).map((option) => {
      option.style.display = "";
    });
  });
}

// Fonction pour configurer les événements des selects
function selectEvents() {
  document
    .querySelectorAll(".selectSection__group__header__container")
    .forEach((container) => {
      const header = container.querySelector(".selectSection__group__header");
      const body = container.querySelector(
        ".selectSection__group__header__container__body"
      );
      const icon = header.querySelector("i");

      // Gérer l'ouverture/fermeture lors du clic sur le select
      header.addEventListener("click", () => {
        body.classList.toggle("selectSection__group__header__displayContainer");
        // Gère les icônes
        body.classList.contains(
          "selectSection__group__header__displayContainer"
        )
          ? (icon.classList.remove("fa-angle-up"),
            icon.classList.add("fa-angle-down"))
          : (icon.classList.remove("fa-angle-down"),
            icon.classList.add("fa-angle-up"));
      });

      initializeSelectSearch(container);
    });
}

// Fonction pour générer les selects
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

  filters.map((filter) => {
    const selectHTML = manageSelectFilter(recipes, filter.key, filter.label);

    document.getElementById(filter.containerId).innerHTML = selectHTML;
  });

  // Configurer les événements pour les selects
  selectEvents();
}
