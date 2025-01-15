// Fonction pour gérer les événements des selects
function bindSelect() {
  document.addEventListener("click", (event) => {
    const option = event.target.closest(
      ".selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectOption"
    );

    if (option) {
      const container = option.closest(
        ".selectSection__groupSelect__selectHeader__selectContainer"
      );
      const type = container.dataset.type;

      const selectedItemsDiv = container.querySelector(".selected-items");

      // Vérifie si le tag est déjà sélectionné
      if (selectedTags[type].has(option.dataset.value)) {
        return; // Ne pas ajouter un tag déjà sélectionné
      }

      // Ajouter la classe à l'option sélectionnée
      option.classList.add(
        "selectSection__groupSelect__selectHeader__selectContainer__selectBody__selectOptionsContainer__selectedOption"
      );

      // Ajouter le tag dans l'interface utilisateur
      selectedItemsDiv.insertAdjacentHTML(
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
}
