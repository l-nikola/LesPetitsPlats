const selectedTags = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

// Fonction pour créer les selects
function createCustomSelectFilter(data, type, placeholder) {
  let filter = [];
  if (type === "appliances") {
    filter = [...new Set(data.map((recipe) => recipe.appliance.toLowerCase()))]
      .sort()
      .map(
        (appliance) => appliance.charAt(0).toUpperCase() + appliance.slice(1)
      );
  } else if (type === "ustensils") {
    filter = [
      ...new Set(
        data.flatMap((recipe) =>
          recipe.ustensils.map((ustensil) => ustensil.toLowerCase().trim())
        )
      ),
    ]
      .sort()
      .map((ustensil) => ustensil.charAt(0).toUpperCase() + ustensil.slice(1));
  } else if (type === "ingredients") {
    filter = [
      ...new Set(
        data.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) =>
            ingredient.ingredient.toLowerCase().trim()
          )
        )
      ),
    ]
      .sort()
      .map(
        (ingredient) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)
      );
  } else {
    throw new Error(`Type ${type} unknown`);
  }

  return `
    <div class="selectSection__groupSelect__selectHeader__selectContainer" data-type="${type}">
      <div class="selectSection__groupSelect__selectHeader">
        <span class="selectSection__groupSelect__selectHeader__label">${placeholder}</span>
        <i class="fa-solid fa-angle-down"></i>
      </div>
      <div class="selectSection__groupSelect__selectHeader__selectContainer__selectBody selectSection__groupSelect__selectHeader__displayContainer">
        <input 
          class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectInput"
          type="text" 
        />
        <i
            class="fa-solid fa-xmark fa-sm selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectInput__crossBtn"
          ></i>
        <i
          class="fa-solid fa-magnifying-glass selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectInput__magnifyingGlass"
        ></i>
        <ul class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer">
          ${filter
            .map(
              (option) => `
                <li class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption" data-value="${option.toLowerCase()}">
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
  updateSelectOptions("ingredients", availableIngredients);
  updateSelectOptions("appliances", availableAppliances);
  updateSelectOptions("ustensils", availableUstensils);
}

// Fonction pour mettre à jour les options d'un select
function updateSelectOptions(type, availableOptions) {
  const container = document.querySelector(
    `.selectSection__groupSelect__selectHeader__selectContainer[data-type="${type}"]`
  );

  const optionsContainer = container.querySelector(
    ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer"
  );

  // Construire et insérer la liste des options
  const optionsHTML = [...availableOptions]
    .sort()
    .map((option) => {
      return `
        <li class="selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption ${
          // Si l'option est sélectionnée, on réapplique la classe
          selectedTags[type].has(option)
            ? "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
            : ""
        }" data-value="${option}">
          ${option.charAt(0).toUpperCase() + option.slice(1)}
        </li>
      `;
    })
    .join("");

  optionsContainer.innerHTML = optionsHTML;
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
        body.classList.toggle(
          "selectSection__groupSelect__selectHeader__displayContainer"
        );
        // Gère les icônes
        body.classList.contains(
          "selectSection__groupSelect__selectHeader__displayContainer"
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
