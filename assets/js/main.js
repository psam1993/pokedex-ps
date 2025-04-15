let allPokemons = [];
let offset = 0;
const limit = 11;
let currentPokemonIndex = -1;

const pokeList = document.querySelector('.pokemons');
const loadMoreBtn = document.getElementById('load-more');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('search-filter-form');

const modal = document.getElementById('pokemon-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalName = document.getElementById('modal-name');
const modalImage = document.getElementById('modal-image');
const modalId = document.getElementById('modal-id');
const modalTypes = document.getElementById('modal-types');
const modalHeight = document.getElementById('modal-height');
const modalWeight = document.getElementById('modal-weight');
const modalAbilities = document.getElementById('modal-abilities');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Função principal para carregar da API
async function loadPokemons() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    const data = await res.json();

    for (const item of data.results) {
        const pokemon = await fetchPokemon(item.url);
        allPokemons.push(pokemon);
        createCard(pokemon, allPokemons.length - 1);
    }

    offset += limit;
}

// Busca por nome na API (caso não esteja na lista)
async function searchPokemon(term) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`);
    if (!res.ok) {
        alert('Pokémon não encontrado!');
        return;
    }
    const pokemon = await res.json();
    pokeList.innerHTML = '';
    allPokemons = [pokemon];
    createCard(pokemon, 0);
}
// Limpar lista ao digitar no campo de busca;
    searchInput.addEventListener('input', () => {
        const value = searchInput.value.toLowerCase().trim();
        if (!value) {
        pokeList.innerHTML = '';
        offset = 0;
        allPokemons = [];
        loadPokemons();
        }
  });
// Criar card
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
    pokeList.appendChild(li);
}

// Fetch dados completos
async function fetchPokemon(url) {
    const res = await fetch(url);
    return await res.json();
}

// Mostrar modal com detalhes do Pokémon
function showPokemonModal(pokemon, index) {
    currentPokemonIndex = index;
    modalName.textContent = pokemon.name;
    modalImage.src = pokemon.sprites.other['official-artwork'].front_default;
    modalId.textContent = `#${pokemon.id}`;
    modalHeight.textContent = `${pokemon.height / 10} m`;
    modalWeight.textContent = `${pokemon.weight / 10} kg`;
    modalAbilities.textContent = pokemon.abilities.map(a => a.ability.name).join(', ');
    modalTypes.innerHTML = '';
    pokemon.types.forEach(t => {
        const span = document.createElement('span');
        span.className = 'type ' + t.type.name;
        span.textContent = t.type.name;
        modalTypes.appendChild(span);
    });
    modal.classList.remove('hidden');
}

// Fechar modal
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') modal.classList.add('hidden');
    if (e.key === 'ArrowLeft' && currentPokemonIndex > 0) showPokemonModal(allPokemons[currentPokemonIndex - 1], currentPokemonIndex - 1);
    if (e.key === 'ArrowRight' && currentPokemonIndex < allPokemons.length - 1) showPokemonModal(allPokemons[currentPokemonIndex + 1], currentPokemonIndex + 1);
});
prevBtn.addEventListener('click', () => {
    if (currentPokemonIndex > 0) showPokemonModal(allPokemons[currentPokemonIndex - 1], currentPokemonIndex - 1);
});
nextBtn.addEventListener('click', () => {
    if (currentPokemonIndex < allPokemons.length - 1) showPokemonModal(allPokemons[currentPokemonIndex + 1], currentPokemonIndex + 1);
});

// Filtrar Pokémons
searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase().trim();

    pokeList.innerHTML = '';

    const filtered = allPokemons.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().includes(value);
        const idMatch = pokemon.id.toString() === value;
        const typeMatch = pokemon.types.some(t => t.type.name.toLowerCase().includes(value));
        return nameMatch || idMatch || typeMatch;
    });

    filtered.forEach((pokemon, index) => {
        createCard(pokemon, allPokemons.indexOf(pokemon));
    });
});

// Botão carregar mais
loadMoreBtn.addEventListener('click', () => {
    loadPokemons();
});

// Form de busca
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = searchInput.value.trim();
    if (value) searchPokemon(value);
});

const toggleDarkMode = document.getElementById('dark-mode-toggle');
toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

loadPokemons();
