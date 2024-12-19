// Fonction pour générer la div des selects
function generateSelectDiv() {
  // Chaîne HTML définissant la structure de la div
  const selectHTML = `
    <div class="selectSection__groupSelect__selectDiv">
      <span>Ingrédients</span>
      <i class="fa-solid fa-angle-down"></i>
      <div class="selectSection__groupSelect__selectDiv__input" style="display: none;">
        <form>
          <input type="text" placeholder="Entrez un ingrédient">
          <button type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>
    </div>
  `;

  // Analyse la chaîne HTML et crée la div principale
  const selectDiv = new DOMParser().parseFromString(selectHTML, 'text/html').body.firstChild;

  // Gère l'affichage de l'input au clic
  selectDiv.addEventListener('click', () => {
    const inputDiv = selectDiv.querySelector('.selectSection__groupSelect__selectDiv__input');
    inputDiv.style.display = (inputDiv.style.display === 'none') ? 'block' : 'none'; // Alterne l'affichage
  });

  return selectDiv;
}

// Générer le select
const container = document.getElementById('ingredientsSelectContainer');
const selectDiv = generateSelectDiv();
container.appendChild(selectDiv);
