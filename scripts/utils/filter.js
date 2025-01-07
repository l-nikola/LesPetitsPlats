const selectedTags = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

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

// Fonction pour mettre à jour les recettes affichées
function updateDisplayedRecipes(recipes) {
  const searchTerm = document.getElementById("searchBar").value.trim();
  const filteredRecipes = filterRecipesByTags(
    searchTerm.length >= 3
      ? recipes.filter(
          (recipe) =>
            [recipe.name, recipe.description].some((field) =>
              field.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.ingredient
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
        )
      : recipes
  );

  // Afficher les recettes filtrées
  displayRecipes(filteredRecipes, searchTerm);

  // Mettre à jour le compteur
  updateRecipeCounter(filteredRecipes.length);
}

// Fonction pour filtrer les recettes en fonction des tags
function filterRecipesByTags(recipes) {
  return recipes.filter((recipe) => {
    // Vérification des ingrédients
    const hasIngredients = [...selectedTags.ingredients].every((tag) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())
      )
    );

    // Vérification des appareils
    const hasAppliance = [...selectedTags.appliances].every((tag) =>
      recipe.appliance.toLowerCase().includes(tag.toLowerCase())
    );

    // Vérification des ustensiles
    const hasUstensils = [...selectedTags.ustensils].every((tag) =>
      recipe.ustensils.some((ustensil) =>
        ustensil.toLowerCase().includes(tag.toLowerCase())
      )
    );

    // Retourne true si toutes les conditions sont remplies
    return hasIngredients && hasAppliance && hasUstensils;
  });
}

// Fonction pour gérer les événements des selects
function bindSelect() {
  document.addEventListener("click", (event) => {
    const option = event.target.closest(
      ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption"
    );

    if (option) {
      const container = option.closest(
        ".selectSection__groupSelect__selectHeader__selectContainer"
      );
      const type = container.dataset.type;

      const selectedItemsDiv = container.querySelector(".selected-items");

      // Vérifie si le tag est déjà sélectionné
      if (selectedTags[type].has(option.dataset.value)) {
        return; // Ne pas ajouter un tag déjà sélectionné
      }

      // Ajouter la classe à l'option sélectionnée
      option.classList.add(
        "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
      );

      // Ajouter le tag dans l'interface utilisateur
      selectedItemsDiv.insertAdjacentHTML(
        "beforeend",
        `
        <div class="selectSection__groupSelect__selectHeader__selectedItem" data-type="${type}" data-value="${option.dataset.value}">
          ${option.textContent}
          <button class="selectSection__groupSelect__selectHeader__selectedItem__remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `
      );

      // Ajouter le tag à la structure
      selectedTags[type].add(option.dataset.value);

      // Mettre à jour l'affichage des recettes
      updateDisplayedRecipes(recipes);

      // Ajouter un gestionnaire pour le bouton de suppression
      selectedItemsDiv.lastElementChild
        .querySelector(
          ".selectSection__groupSelect__selectHeader__selectedItem__remove"
        )
        .addEventListener("click", (event) => {
          const tagElement = event.target.closest(
            ".selectSection__groupSelect__selectHeader__selectedItem"
          );
          const tagType = tagElement.dataset.type;
          const tagValue = tagElement.dataset.value;

          // Supprimer le tag de l'interface utilisateur
          tagElement.remove();

          // Retirer le tag de la structure
          selectedTags[tagType].delete(tagValue);

          // Supprimer la classe de l'option correspondante
          const correspondingOption = container.querySelector(
            `.selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption[data-value="${tagValue}"]`
          );
          if (correspondingOption) {
            correspondingOption.classList.remove(
              "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
            );
          }

          // Mettre à jour l'affichage des recettes
          updateDisplayedRecipes(recipes);
        });
    }
  });
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
    Array.from(container.querySelectorAll("li")).forEach((option) => {
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
    Array.from(container.querySelectorAll("li")).forEach((option) => {
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
