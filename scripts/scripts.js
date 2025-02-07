// Fonction pour filtrer les recettes
function filterRecipes(searchBarId, crossIconClass, recipes) {
  const searchBar = document.getElementById(searchBarId);
  const crossIcon = document.querySelector(`.${crossIconClass}`);

  if (searchBar && crossIcon) {
    const updateDisplay = (searchTerm) => {
      let recipesToDisplay = [];

      if (searchTerm.length >= 3) {
        for (const recipe of recipes) {
          const nameMatch = recipe.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const descriptionMatch = recipe.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          if (nameMatch || descriptionMatch) {
            recipesToDisplay.push(recipe);
          }
        }
      } else {
        recipesToDisplay = recipes;
      }

      const filteredRecipes = filterRecipesByTags(recipesToDisplay);

      displayRecipes(filteredRecipes, searchTerm);
      updateRecipeCounter(filteredRecipes.length);
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

    // Gestion de la soumission du formulaire
    document
      .querySelector(".headerSection__container__searchBtn")
      .addEventListener("click", (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page

        const searchTerm = searchBar.value.trim();

        if (searchTerm) {
          // Mettre à jour l'affichage des recettes
          updateDisplay(searchTerm);

          // Trouver les tags correspondants
          const matchingTags = findMatchingTags(searchTerm, recipes);

          if (matchingTags.length > 0) {
            addTag(matchingTags[0], "ingredients");

            searchBar.value = "";
            crossIcon.style.display = "none";
            updateDisplay("");
          }
        }
      });
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  filterRecipes("searchBar", "headerSection__container__crossBtn", recipes);
  // Afficher toutes les recettes au chargement
  displayRecipes(recipes);
  // Générer le compteur
  updateRecipeCounter(recipes.length);
  // Afficher les selects
  generateSelects(recipes);
});
