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
  document.addEventListener("change", (event) => {
    const select = event.target;
    if (select.classList.contains("selectSection__groupSelect__selectHeader")) {
      const selectedItemsDiv = select
        // .closest(".select-container")
        .querySelector(".selected-items");

      // Vérifiez si une valeur a été sélectionnée
      if (select.value) {
        // Récupère la valeur non lowerCase
        const originalValue = Array.from(select.options).find(
          (option) => option.value === select.value
        ).textContent;

        // Ajouter l'élément sélectionné avec une structure HTML
        selectedItemsDiv.insertAdjacentHTML(
          "beforeend",
          `
          <div class="selectSection__groupSelect__select__selectedItem">
            ${originalValue}
            <button class="selectSection__groupSelect__select__selectedItem__remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `
        );

        // Ajouter un gestionnaire d'événements pour le bouton de suppression
        const removeButton = selectedItemsDiv.querySelector(
          `.selectSection__groupSelect__select__selectedItem:last-child .selectSection__groupSelect__select__selectedItem__remove`
        );
        removeButton.addEventListener("click", () => {
          // Supprimer l'élément de la liste affichée
          removeButton.parentElement.remove();
        });
      }

      // Réinitialiser la sélection
      select.value = "";
    }
  });
}

function selectEvents() {
  document
    .querySelectorAll(
      ".selectSection__groupSelect__selectHeader__selectContainer"
    )
    .forEach((container) => {
      // Gérer l'ouverture/fermeture lors du clic sur le select
      container
        .querySelector(".selectSection__groupSelect__selectHeader")
        .addEventListener("click", () => {
          container
            .querySelector(
              ".selectSection__groupSelect__selectHeader__selectContainer__selectBody"
            )
            .classList.toggle("hidden");
        });
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
