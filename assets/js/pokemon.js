import { showPokemonModal } from './main.js';

function createCard(pokemon, index) {
  const li = document.createElement('li');
  li.className = 'pokemon';
  li.innerHTML = `
    <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
    <span class="name">${pokemon.name}</span>
    <div class="detail">
      <ol class="types">
        ${pokemon.types.map(t => `<li class="type ${t.type.name}">${t.type.name}</li>`).join('')}
      </ol>
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    </div>
  `;
  li.addEventListener('click', () => showPokemonModal(pokemon, index));
  document.querySelector('.pokemons').appendChild(li);
}
