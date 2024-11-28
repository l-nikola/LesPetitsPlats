function filterRecipes(searchTerm) {
  const filteredRecipes = recipes.filter((recipe) => {
    // Vérifier si le texte saisi est dans :
    // Le titre de la recette
    const name = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Les ingrédients (recherche dans le tableau d'ingrédients)
    const ingredient = recipe.ingredients.some((ingredient) =>
      ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. La description
    const description = recipe.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return name || ingredient || description;
  });

  // Afficher les recettes
  console.clear(); // Remove
  if (filteredRecipes.length > 0) {
    console.log(filteredRecipes);
  } else {
    console.log(
      `Aucune recette ne contient '${searchTerm}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.`
    );
  }
  return filteredRecipes;
}

// Ajouter un écouteur d'événement sur la barre de recherche
document.getElementById("searchBar").addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim(); // Récupérer le texte saisi
  if (searchTerm.length > 3) {
    const filteredRecipes = filterRecipes(searchTerm); // Filtre les recettes

    // Récupérer l'élément HTML pour afficher le nombre
    const recipeCountElement = document.getElementById("recipeCounter");

    // Mettre à jour le nombre de recettes affichées
    recipeCountElement.textContent = `${filteredRecipes.length} recette${
      filteredRecipes.length > 1 ? "s" : ""
    }`;
  }
});
