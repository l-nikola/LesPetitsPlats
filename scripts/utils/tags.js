// Fonction pour gérer les événements des selects et des options
function bindSelectAndOptions(type) {
  document
    .querySelectorAll(`.selectSection__group__container[data-type="${type}"]`)
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
          option.classList.add("selectSection__group__selectedOption");

          // Ajouter le tag dans l'interface utilisateur
          tagsSection.insertAdjacentHTML(
            "beforeend",
            generateTagHTML(type, option.dataset.value, option.textContent)
          );

          // Ajouter le tag à la structure
          selectedTags[type].add(option.dataset.value);

          // Mettre à jour l'affichage des recettes
          updateDisplayedRecipes(recipes);

          // Ajouter un gestionnaire pour le bouton de suppression
          tagsSection.lastElementChild
            .querySelector(".remove")
            .addEventListener("click", (event) => {
              removeTag(
                event.target.closest(".selectSection__group__selectedTag"),
                container
              );
            });
        });

        // Afficher la croix sur le survol de l'option sélectionnée
        if (option.classList.contains("selectSection__group__selectedOption")) {
          option.addEventListener("mouseover", () => {
            if (!option.querySelector(".remove-option")) {
              option.insertAdjacentHTML(
                "beforeend",
                `<i class="fa-solid fa-xmark fa-xs remove-option"></i>`
              );
            }
          });
        }

        // Suppression lors du clique sur l'icône de croix
        option.addEventListener("click", (event) => {
          if (event.target.classList.contains("remove-option")) {
            removeTag(option, container);
          }
        });
      });
    });
}

// Fonction pour générer le HTML d'un tag
function generateTagHTML(type, value, textContent) {
  return `
    <div class="selectSection__group__selectedTag" data-type="${type}" data-value="${value}">
      <span>${textContent}</span>
      <button class="remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;
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
  const tagsSection = document.querySelector(".tagsSection");

  if (selectedTags[type].has(value.toLowerCase())) return;

  selectedTags[type].add(value.toLowerCase());
  tagsSection.insertAdjacentHTML(
    "beforeend",
    generateTagHTML(type, value.toLowerCase(), value)
  );

  // Ajouter un gestionnaire pour le bouton de suppression
  tagsSection.lastElementChild
    .querySelector(".remove")
    .addEventListener("click", (event) => {
      const tagElement = event.target.closest(
        ".selectSection__group__selectedTag"
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

// Fonction pour supprimer un tag / option sélectionnée
function removeTag(element, container) {
  const tagValue = element.dataset.value;
  const tagType = container.dataset.type;

  // Retirer le tag de la structure
  selectedTags[tagType].delete(tagValue);

  // Supprimer le tag dans la liste des tags
  const tagElement = document.querySelector(
    `.selectSection__group__selectedTag[data-type="${tagType}"][data-value="${tagValue}"]`
  );
  if (tagElement) {
    tagElement.remove();
  }

  // Supprimer la classe de l'option dans la liste des filtres
  const optionElement = container.querySelector(
    `.option[data-value="${tagValue}"]`
  );
  if (optionElement) {
    optionElement.classList.remove("selectSection__group__selectedOption");
  }

  // Mettre à jour l'affichage des recettes
  updateDisplayedRecipes(recipes);
}
