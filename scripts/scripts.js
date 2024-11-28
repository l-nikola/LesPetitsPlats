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

// Ajouter un écouteur d'événement sur la barre de recherche
document.getElementById("searchBar").addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim(); // Récupérer le texte saisi
  if (searchTerm.length > 3) {
    const filteredRecipes = filterRecipes(searchTerm); // Filtre les recettes

    // Afficher les recettes dans la console
    console.clear();
    if (filteredRecipes.length > 0) {
      console.log(filteredRecipes);
    } else {
      console.log(
        `Aucune recette ne contient '${searchTerm}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.`
      );
    }

    // Mettre à jour le nombre de recettes affichées
    document.getElementById("recipeCounter").textContent = `${
      filteredRecipes.length
    } recette${filteredRecipes.length > 1 ? "s" : ""}`;
  }
});
