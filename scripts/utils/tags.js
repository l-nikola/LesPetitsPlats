// Fonction pour gérer les événements des selects
function bindSelect() {
  document
    .querySelectorAll(
      ".selectSection__groupSelect__selectHeader__selectContainer"
    )
    .forEach((container) => {
      container.addEventListener("click", (event) => {
        const option = event.target.closest(
          ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption"
        );

        if (option) {
          const type = container.dataset.type;
          const tagsSection = document.querySelector(".tagsSection");

          // Vérifie si le tag est déjà sélectionné
          if (selectedTags[type].has(option.dataset.value)) {
            return; // Ne pas ajouter un tag déjà sélectionné
          }

          // Ajouter la classe à l'option sélectionnée
          option.classList.add(
            "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
          );

          // Ajouter le tag dans l'interface utilisateur
          tagsSection.insertAdjacentHTML(
            "beforeend",
            `
          <div class="selectSection__groupSelect__selectHeader__selectedItem" data-type="${type}" data-value="${option.dataset.value}">
            ${option.textContent}
            <button class="selectSection__groupSelect__selectHeader__selectedItem__remove">
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

              // Supprimer la classe de l'option correspondante
              const correspondingOption = container.querySelector(
                `.selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption[data-value="${tagValue}"]`
              );
              if (correspondingOption) {
                correspondingOption.classList.remove(
                  "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
                );
              }

              // Mettre à jour l'affichage des recettes
              updateDisplayedRecipes(recipes);
            });
        }
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
