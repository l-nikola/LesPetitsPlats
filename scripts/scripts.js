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
