// Fonction pour gérer les événements des selects et des options
function bindSelectAndOptions() {
  document
    .querySelectorAll(".selectSection__group__container")
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
            `
            <div class="selectSection__group__selectedTag" data-type="${type}" data-value="${option.dataset.value}">
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
                `<i class="fa-solid fa-xmark remove-option"></i>`
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

// Fonction pour supprimer un tag / option sélectionnée
function removeTag(element, container) {
  const tagValue = element.dataset.value;
  const tagType = container.dataset.type;

  // Retirer le tag de la structure
  selectedTags[tagType].delete(tagValue);

  // Supprimer le tag dans la liste des tags
  document
    .querySelector(
      `.selectSection__group__selectedTag[data-type="${tagType}"][data-value="${tagValue}"]`
    )
    .remove();

  // Supprimer la classe de l'option dans la liste des filtres
  container
    .querySelector(`.option[data-value="${tagValue}"]`)
    .classList.remove("selectSection__group__selectedOption");

  // Mettre à jour l'affichage des recettes
  updateDisplayedRecipes(recipes);
}
