// Fonction pour générer une carte de recette
function generateRecipeCard({ image, time, name, description, ingredients }) {
  const ingredientList = ingredients
    .map(
      ({ ingredient, quantity = "", unit = "" }) => `
      <li class="col-6">
        <span class="recipe__card__info__ingredients__name">${ingredient}</span><br />
        <span class="recipe__card__info__ingredients__quantity">${quantity} ${unit}</span>
      </li>
    `
    )
    .join("");

  return `
    <article class="col-md-4 mb-6 mx-4 recipe">
      <a href="#">
        <figure class="recipe__card">
          <img src="${image}" alt="Image montrant le résultat de la recette" class="recipe__card__img" />
          <figcaption class="recipe__card__info">
            <p class="recipe__card__time">${time} min</p>
            <h2 class="recipe__card__info__title">${name}</h2>
            <section class="recipe__card__info__steps">
              <h3 class="recipe__card__info__subTitle">RECETTE</h3>
              <p class="recipe__card__info__steps__text">${description}</p>
            </section>
            <section class="recipe__card__info__ingredients">
              <h3 class="recipe__card__info__subTitle">INGRÉDIENTS</h3>
              <ul class="row g-3">${ingredientList}</ul>
            </section>
          </figcaption>
        </figure>
      </a>
    </article>
  `;
}

// Fonction pour afficher les cartes de recettes
function displayRecipes(recipes, searchTerm = "") {
  const recipeContainer = document.getElementById("recipeContainer");
  recipeContainer.innerHTML =
    recipes && recipes.length
      ? recipes.map(generateRecipeCard).join("")
      : `<p class="text-center">Aucune recette ne contient '${searchTerm}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc..</p>`;
}

// Fonction pour mettre à jour le compteur de recettes
function updateRecipeCounter(count) {
  document.getElementById("recipeCounter").textContent = `${count} recette${
    count > 1 ? "s" : ""
  }`;
}

// Fonction pour mettre à jour les recettes affichées
function updateDisplayedRecipes(recipes) {
  const searchTerm = document.getElementById("searchBar").value;
  const filteredRecipes = filterRecipesByTags(
    searchTerm.length >= 3
      ? recipes.filter(
          ({ name, description, ingredients }) =>
            [name, description].some((field) =>
              field.toLowerCase().includes(searchTerm)
            ) ||
            ingredients.some(({ ingredient }) =>
              ingredient.toLowerCase().includes(searchTerm)
            )
        )
      : recipes
  );

  // Afficher les recettes filtrées
  displayRecipes(filteredRecipes, searchTerm);

  // Mettre à jour le compteur
  updateRecipeCounter(filteredRecipes.length);

  // Mettre à jour les options disponibles dans les selects
  updateAvailableOptions(filteredRecipes);
}

// Fonction pour filtrer les recettes en fonction des tags
function filterRecipesByTags(recipes) {
  return recipes.filter(({ ingredients, appliance, ustensils }) => {
    // Vérification des ingrédients
    const matchesIngredients = [...selectedTags.ingredients].every((tag) =>
      ingredients.some(({ ingredient }) =>
        ingredient.toLowerCase().includes(tag.toLowerCase())
      )
    );

    // Vérification des appareils
    const matchesAppliance = [...selectedTags.appliances].every((tag) =>
      appliance.toLowerCase().includes(tag.toLowerCase())
    );

    // Vérification des ustensiles
    const matchesUstensils = [...selectedTags.ustensils].every((tag) =>
      ustensils.some((ustensil) =>
        ustensil.toLowerCase().includes(tag.toLowerCase())
      )
    );

    // Retourne true si toutes les conditions sont remplies
    return matchesIngredients && matchesAppliance && matchesUstensils;
  });
}
