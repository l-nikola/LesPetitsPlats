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
    `.selectSection__group__container[data-type="${type}"]`
  );

  const optionsHTML = filter
    .map((option) => {
      return `
        <li class="option ${
          selectedTags[type].has(option.toLowerCase())
            ? "selectSection__group__selectedOption"
            : ""
        }" data-value="${option.toLowerCase()}">
          ${option}
        </li>
      `;
    })
    .join("");

  if (container) {
    const optionsContainer = container.querySelector(
      ".selectSection__group__container__body__optionsContainer"
    );

    optionsContainer.innerHTML = optionsHTML;

    // Déplacer les options sélectionnées en haut de la liste
    selectedTags[type].forEach((value) => {
      const selectedOption = optionsContainer.querySelector(
        `.option[data-value="${value}"]`
      );
      if (selectedOption) {
        optionsContainer.prepend(selectedOption);
      }
    });
  } else {
    const containerHTML = `
    <div class="selectSection__group__container" data-type="${type}">
      <div class="selectSection__group__header">
        <span>${placeholder}</span>
        <i class="fa-solid fa-angle-down"></i>
      </div>
      <div
        class="selectSection__group__container__body selectSection__group__displaySelect"
      >
        <input type="text" />
        <i class="fa-solid fa-xmark fa-sm"></i>
        <i class="fa-solid fa-magnifying-glass"></i>
        <ul
          class="selectSection__group__container__body__optionsContainer"
        >
          ${optionsHTML}
        </ul>
      </div>
      <div class="selected-items" data-type="${type}"></div>
    </div>
  `;
    document.getElementById(type).innerHTML = containerHTML;
  }

  // Ecouter le clic sur les options
  bindSelectAndOptions(type);
}

// Fonction pour recalculer les options disponibles
function updateAvailableOptions(filteredRecipes) {
  const availableIngredients = new Set();
  const availableAppliances = new Set();
  const availableUstensils = new Set();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      availableIngredients.add(ingredient.ingredient.toLowerCase());
    }
    availableAppliances.add(recipe.appliance.toLowerCase());
    for (const ustensil of recipe.ustensils) {
      availableUstensils.add(ustensil.toLowerCase());
    }
  }

  // Mise à jour des options dans chaque champ
  manageSelectFilter(filteredRecipes, "ingredients", "Ingrédients");
  manageSelectFilter(filteredRecipes, "appliances", "Appareils");
  manageSelectFilter(filteredRecipes, "ustensils", "Ustensiles");
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
    .querySelectorAll(".selectSection__group__container")
    .forEach((container) => {
      const header = container.querySelector(".selectSection__group__header");
      const body = container.querySelector(
        ".selectSection__group__container__body"
      );
      const icon = header.querySelector("i");

      // Gérer l'ouverture/fermeture lors du clic sur le select
      header.addEventListener("click", () => {
        body.classList.toggle("selectSection__group__displaySelect");
        // Gère les icônes
        body.classList.contains("selectSection__group__displaySelect")
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
    },
    {
      key: "appliances",
      label: "Appareils",
    },
    {
      key: "ustensils",
      label: "Ustensiles",
    },
  ];

  filters.map((filter) => {
    manageSelectFilter(recipes, filter.key, filter.label);
  });

  // Configurer les événements pour les selects
  selectEvents();
}
