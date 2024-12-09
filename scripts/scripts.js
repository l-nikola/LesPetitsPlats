// Fonction pour filtrer les recettes
function filterRecipes(searchTerm) {
  // Vérifier si le texte saisi correspond au titre, un ingrédient ou la description
  return recipes.filter(
    (recipe) =>
      [recipe.name, recipe.description].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
}

// Fonction pour générer un select avec tous les ingrédients
function generateAllIngredientsSelect(recipes) {
  const uniqueIngredients = [
    // Éliminer les doublons
    ...new Set(
      recipes.flatMap(
        (recipe) =>
          recipe.ingredients.map((ingredient) =>
            ingredient.ingredient.toLowerCase().replace(/s$/, "")
          ) // Met en minuscule et supprime le "s" final
      )
    ),
  ].sort();
  return `
    <select
      class="selectSection__groupSelect__select"
      name="allIngredients"
    >
      <option value="" hidden>Ingrédients</option>
      ${uniqueIngredients.map(
        (ingredient) => `
            <option value="${ingredient}">${ingredient}</option>
          `
      )}
    </select>
  `;
}

// Fonction pour générer un select avec tous les appareils
function generateAllAppliancesSelect(recipes) {
  const uniqueAppliances = [
    // Éliminer les doublons
    ...new Set(recipes.map((recipe) => recipe.appliance.toLowerCase())),
  ].sort();

  return `
    <select
      class="selectSection__groupSelect__select"
      name="allAppliances"
    >
      <option value="" hidden>Appareils</option>
      ${uniqueAppliances
        .map(
          (appliance) => `
            <option value="${appliance}">${appliance}</option>
          `
        )
        .join("")}
    </select>
  `;
}

// Fonction pour générer une carte de recette
function generateRecipeCard(recipe) {
  return `
    <article class="col-md-4 mb-6 mx-4 recipe">
      <a href="#">
        <figure class="recipe__card">
          <!--**** Recipe picture  ****-->
          <img
            src=${recipe.image}
            alt="Image montrant le résultat de la recette"
            class="recipe__card__img"
          />
          <!--**** Recipe info  ****-->
          <figcaption class="recipe__card__info">
            <!--**** Recipe time  ****-->
            <p class="recipe__card__time">${recipe.time} min</p>
            <!--**** Recipe title  ****-->
            <h2 class="recipe__card__info__title">${recipe.name}</h2>
            <!--**** Recipe steps section****-->
            <section class="recipe__card__info__steps">
              <h3 class="recipe__card__info__subTitle">RECETTE</h3>
              <p class="recipe__card__info__steps__text">
                ${recipe.description}
              </p>
            </section>
            <!--**** Recipe ingredients section  ****-->
            <section class="recipe__card__info__ingredients">
              <h3 class="recipe__card__info__subTitle">INGRÉDIENTS</h3>
              <ul class="row g-3">
                ${recipe.ingredients
                  .map(
                    (ingredient) => `
                      <li class="col-6">
                        <span class="recipe__card__info__ingredients__name">
                          ${ingredient.ingredient}
                        </span><br />
                        <span class="recipe__card__info__ingredients__quantity">
                          ${ingredient.quantity || ""} ${ingredient.unit || ""}
                        </span>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
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
  if (recipes.length > 0) {
    recipeContainer.innerHTML = recipes
      .map((recipe) => generateRecipeCard(recipe))
      .join("");
  } else {
    recipeContainer.innerHTML = `
      <p class="text-center"> Aucune recette ne contient '${searchTerm}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc..</p>
    `;
  }
}

// Fonction pour mettre à jour le compteur de recettes
function updateRecipeCounter(count) {
  document.getElementById("recipeCounter").textContent = `${count} recette${
    count > 1 ? "s" : ""
  }`;
}

// Écouteur pour la barre de recherche
document.getElementById("searchBar").addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim(); // Récupérer le texte saisi
  const recipesToDisplay =
    searchTerm.length >= 3 ? filterRecipes(searchTerm) : recipes;

  // Réinitialiser l'affichage et afficher les recettes
  displayRecipes(recipesToDisplay, searchTerm);

  // Mettre à jour le compteur de recettes affichées
  updateRecipeCounter(recipesToDisplay.length);
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  // Afficher toutes les recettes au chargement
  displayRecipes(recipes);
  // Générer le compteur
  updateRecipeCounter(recipes.length);
  // Générer le select des ingrédients
  const ingredientSelectHTML = generateAllIngredientsSelect(recipes);
  document.getElementById("ingredientsSelectContainer").innerHTML =
    ingredientSelectHTML;
  // Générer le select des appareils
  const applianceSelectHTML = generateAllAppliancesSelect(recipes);
  document.getElementById("appliancesSelectContainer").innerHTML =
    applianceSelectHTML;
});
