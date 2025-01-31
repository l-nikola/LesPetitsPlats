// Fonction pour gérer les événements des selects et des options
function bindSelectAndOptions() {
  document
    .querySelectorAll(".selectSection__group__header__container")
    .forEach((container) => {
      // Récupérer les elements li
      const options = container.querySelectorAll(".option");
      // Boucler sur les elements li
      options.forEach((option) => {
        // Ecouter le click
        option.addEventListener("click", () => {
          const type = container.dataset.type;
          const tagsSection = document.querySelector(".tagsSection");

          // Vérifie si le tag est déjà sélectionné
          if (selectedTags[type].has(option.dataset.value)) {
            return; // Ne pas ajouter un tag déjà sélectionné
          }

          // Ajouter la classe à l'option sélectionnée
          option.classList.add(
            "selectSection__group__header__container__body__optionsContainer__selected"
          );

          // Ajouter le tag dans l'interface utilisateur
          tagsSection.insertAdjacentHTML(
            "beforeend",
            `
            <div class="selectSection__group__header__selectedItem" data-type="${type}" data-value="${option.dataset.value}">
              ${option.textContent}
              <button class="remove">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          `
          );

          // Ajouter le tag à la structure
          selectedTags[type].add(option.dataset.value);

          // Mettre à jour l'affichage des recettes
          updateDisplayedRecipes(recipes);

          // Ajouter un gestionnaire pour le bouton de suppression
          tagsSection.lastElementChild
            .querySelector(".remove")
            .addEventListener("click", (event) => {
              const tagElement = event.target.closest(
                ".selectSection__group__header__selectedItem"
              );
              const tagType = tagElement.dataset.type;
              const tagValue = tagElement.dataset.value;

              // Supprimer le tag de l'interface utilisateur
              tagElement.remove();

              // Retirer le tag de la structure
              selectedTags[tagType].delete(tagValue);

              // Supprimer la classe de l'option correspondante
              const correspondingOption = container.querySelector(
                `.option[data-value="${tagValue}"]`
              );
              if (correspondingOption) {
                correspondingOption.classList.remove(
                  "selectSection__group__header__container__body__optionsContainer__selected"
                );
              }

              // Mettre à jour l'affichage des recettes
              updateDisplayedRecipes(recipes);
            });
        });
      });
    });
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
    `.selectSection__group__header__container[data-type="${type}"]`
  );
  const selectedItemsDiv = container.querySelector(".selected-items");

  if (selectedTags[type].has(value.toLowerCase())) {
    return;
  }

  selectedTags[type].add(value.toLowerCase());
  selectedItemsDiv.insertAdjacentHTML(
    "beforeend",
    `
    <div class="selectSection__group__header__selectedItem" data-type="${type}" data-value="${value.toLowerCase()}">
      ${value}
      <button class="remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `
  );

  // Ajouter un gestionnaire pour le bouton de suppression
  selectedItemsDiv.lastElementChild
    .querySelector(".remove")
    .addEventListener("click", (event) => {
      const tagElement = event.target.closest(
        ".selectSection__group__header__selectedItem"
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
