// Fonction pour créer un select
function createSelectFilter(data, type, placeholder) {
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
  <div class="select-container">
    <select
      class="selectSection__groupSelect__select"
      name="${type}"
    >
      <option value="" hidden>${placeholder}</option>
      ${filter
        .map(
          ([lowercase, original]) => `
            <option value="${lowercase}">${original}</option>
          `
        )
        .join("")}
    </select>
    <div class="selected-items" data-type="${type}"></div>
  </div>
`;
}

function bindSelect() {
  document.addEventListener("change", (event) => {
    const select = event.target;
    if (select.classList.contains("selectSection__groupSelect__select")) {
      const selectedItemsDiv = select
        .closest(".select-container")
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

// Fonction générique pour générer les selects
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
    const selectHTML = createSelectFilter(recipes, filter.key, filter.label);
    document.getElementById(filter.containerId).innerHTML = selectHTML;
  });
}
