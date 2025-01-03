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
          class = "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectInput"
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
      selectedItemsDiv.lastElementChild
        .querySelector(
          ".selectSection__groupSelect__selectHeader__selectedItem__remove"
        )
        .addEventListener("click", () => {
          // Supprimer l'élément sélectionné
          selectedItemsDiv.lastElementChild.remove();

          // Supprimer la classe 'selected' de l'option
          option.classList.remove(
            "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
          );
        });
    }

    // Déplacer l'option sélectionnée tout en haut de la liste et lui donner une classe
    option
      .closest(
        ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer"
      )
      .insertAdjacentElement("afterbegin", option);
    option.classList.add(
      "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
    );
  });
}

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
