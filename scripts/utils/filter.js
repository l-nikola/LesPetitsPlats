// Fonction créer un select
function createSelectFilter(data, type, placeholder) {
  let filter = [];
  if (type === "appliances") {
    filter = [
      ...new Set(data.map((recipe) => recipe.appliance.toLowerCase())),
    ].sort();
  } else if (type === "ustensils") {
    filter = [
      ...new Set(
        data.flatMap((recipe) =>
          recipe.ustensils.map((ustensil) =>
            ustensil.toLowerCase().replace(/s$/, "")
          )
        )
      ),
    ].sort();
  } else if (type === "ingredients") {
    filter = [
      ...new Set(
        data.flatMap((recipe) =>
          recipe.ingredients.map((ingredient) =>
            ingredient.ingredient.toLowerCase().replace(/s$/, "")
          )
        )
      ),
    ].sort();
  } else {
    throw new Error(`Type ${type} unknown`);
  }

  document.addEventListener("change", (event) => {
  const select = event.target;
  if (select.classList.contains("selectSection__groupSelect__select")) {
    const selectedValue = select.value;
    const selectedItemsDiv = select.closest(".select-container").querySelector(".selected-items");

    // Vérifiez si une valeur a été sélectionnée
    if (selectedValue) {
      // Ajouter l'élément sélectionné avec une structure HTML
      selectedItemsDiv.insertAdjacentHTML(
        "beforeend",
        `
          <div class="selectSection__groupSelect__select__selectedItem">
            ${selectedValue}
            <button class="selectSection__groupSelect__select__selectedItem__remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `
      );

      // Supprimez l'option sélectionnée du <select>
      const optionToRemove = select.querySelector(`option[value="${selectedValue}"]`);
      if (optionToRemove) {
        optionToRemove.remove();
      }

      // Ajouter un gestionnaire d'événements pour le bouton de suppression
      const removeButton = selectedItemsDiv.querySelector(
        `.selectSection__groupSelect__select__selectedItem:last-child .selectSection__groupSelect__select__selectedItem__remove`
      );
      removeButton.addEventListener("click", () => {
        // Supprimer l'élément de la liste affichée
        removeButton.parentElement.remove();

        // Réintégrer l'option dans le select à la bonne position
        const newOption = document.createElement("option");
        newOption.value = selectedValue;
        newOption.textContent = selectedValue;

        const options = Array.from(select.options);
        const indexToInsert = options.findIndex((opt) => opt.textContent > selectedValue);
        if (indexToInsert === -1) {
          // Ajouter à la fin si aucune position n'est trouvée
          select.appendChild(newOption);
        } else {
          // Insérer avant l'option trouvée
          select.insertBefore(newOption, options[indexToInsert]);
        }
      });
    }

    // Réinitialiser la sélection
    select.value = "";
  }
});

  return `
  <div class="select-container">
    <select
      class="selectSection__groupSelect__select"
      name="${type}"
    >
      <option value="" hidden>${placeholder}</option>
      ${filter
        .map(
          (data) => `
            <option value="${data}">${data}</option>
          `
        )
        .join("")}
    </select>
    <div class="selected-items" data-type="${type}"></div>
  </div>
`;

}

// Fonctions pour générer les selects
function generateAllIngredientsSelect(recipes) {
  return createSelectFilter(recipes, "ingredients", "Ingrédients");
}

function generateAllAppliancesSelect(recipes) {
  return createSelectFilter(recipes, "appliances", "Appareils");
}

function generateAllUstensilsSelect(recipes) {
  return createSelectFilter(recipes, "ustensils", "Ustensiles");
}
