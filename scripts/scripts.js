// Fonction pour filtrer les recettes
function filterRecipes(searchBarId, crossIconClass, recipes) {
  const searchBar = document.getElementById(searchBarId);
  const crossIcon = document.querySelector(`.${crossIconClass}`);

  const updateDisplay = (searchTerm) => {
    const recipesToDisplay =
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
        : recipes;

    displayRecipes(recipesToDisplay, searchTerm);
    updateRecipeCounter(recipesToDisplay.length);
  };

  // Masquer l'icône par défaut
  crossIcon.style.display = "none";

  // Gestion de la barre de recherche
  searchBar.addEventListener("input", () => {
    crossIcon.style.display = searchBar.value.trim() ? "inline" : "none";
    updateDisplay(searchBar.value.trim());
  });

  // Gestion du clic sur l'icône de croix
  crossIcon.addEventListener("click", () => {
    searchBar.value = "";
    crossIcon.style.display = "none";
    updateDisplay("");
  });

  // Gestion du la soumission du formulaire
  document
    .querySelector(".headerSection__inputContainer__searchBtn")
    .addEventListener("click", (event) => {
      event.preventDefault(); // Empêcher le rechargement de la page
      const searchTerm = searchBar.value.trim();
      if (searchTerm) {
        updateDisplay(searchTerm);
      }
    });
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

// Fonction pour rechercher des correspondances de tags existants
function findMatchingTags(searchTerm, recipes) {
  const matchingTags = new Set();
  recipes.map((recipe) => {
    // Ajouter les ingrédients correspondants
    recipe.ingredients.map((ingredient) => {
      if (
        ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        matchingTags.add(ingredient.ingredient);
      }
    });
  });
  return Array.from(matchingTags);
}

// Fonction pour ajouter un tag
function addTag(value, type) {
  const container = document.querySelector(
    `.selectSection__groupSelect__selectHeader__selectContainer[data-type="${type}"]`
  );
  const selectedItemsDiv = container.querySelector(".selected-items");

  if (selectedTags[type].has(value.toLowerCase())) {
    return;
  }

  selectedTags[type].add(value.toLowerCase());
  selectedItemsDiv.insertAdjacentHTML(
    "beforeend",
    `
    <div class="selectSection__groupSelect__selectHeader__selectedItem" data-type="${type}" data-value="${value.toLowerCase()}">
      ${value}
      <button class="selectSection__groupSelect__selectHeader__selectedItem__remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `
  );

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

      // Mettre à jour l'affichage des recettes
      updateDisplayedRecipes(recipes);
    });

  updateDisplayedRecipes(recipes);
}

// Soumission du formulaire
document
  .querySelector(".headerSection__inputContainer__searchBtn")
  .addEventListener("click", () => {
    const searchTerm = searchBar.value.trim();
    if (searchTerm) {
      // Rechercher les tags correspondants
      const matchingTags = findMatchingTags(searchTerm, recipes);
      if (matchingTags.length > 0) {
        addTag(matchingTags[0], "ingredients");
      }
    }
  });

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
  filterRecipes(
    "searchBar",
    "headerSection__inputContainer__crossBtn",
    recipes
  );
  // Afficher toutes les recettes au chargement
  displayRecipes(recipes);
  // Générer le compteur
  updateRecipeCounter(recipes.length);
  // Afficher les selects
  generateSelects(recipes);
  // Gestion des tags
  bindSelect();
});
