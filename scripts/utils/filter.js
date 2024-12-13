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

  return `
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
