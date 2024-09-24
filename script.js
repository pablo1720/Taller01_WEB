const { useState, useEffect, useRef } = React;

const typeColors = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
};

const PokemonCard = ({ pokemon }) => {
    if (!pokemon) return null;

    const mainType = pokemon.types[0].type.name;
    const cardStyle = {
        backgroundColor: typeColors[mainType] || '#FFFFFF',
    };

    return React.createElement("div", { className: "card", style: cardStyle },
        React.createElement("img", {
            src: pokemon.sprites.front_default,
            alt: `${pokemon.name} sprite`,
            className: "pokemon-sprite"
        }),
        React.createElement("h2", null, pokemon.name),
        React.createElement("p", { className: "pokemon-type" }, mainType),
        React.createElement("div", { className: "info-grid" },
            React.createElement("div", { className: "info-item" },
                React.createElement("h3", null, "Height"),
                React.createElement("p", null, `${pokemon.height / 10} m`)
            ),
            React.createElement("div", { className: "info-item" },
                React.createElement("h3", null, "Weight"),
                React.createElement("p", null, `${pokemon.weight / 10} kg`)
            ),
            React.createElement("div", { className: "info-item" },
                React.createElement("h3", null, "Abilities"),
                React.createElement("ul", null, 
                    pokemon.abilities.map((ability, index) =>
                        React.createElement("li", { key: index }, 
                            `${ability.ability.name} ${ability.is_hidden ? '(Hidden)' : ''}`
                        )
                    )
                )
            ),
            React.createElement("div", { className: "info-item" },
                React.createElement("h3", null, "Types"),
                React.createElement("ul", null, 
                    pokemon.types.map((typeInfo, index) =>
                        React.createElement("li", { key: index, style: { color: typeColors[typeInfo.type.name] } },
                            typeInfo.type.name
                        )
                    )
                )
            )
        )
    );
};

const SearchForm = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query.toLowerCase());
    };

    return React.createElement("form", { onSubmit: handleSubmit, className: "search-form" },
        React.createElement("input", {
            type: "text",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Enter Pokémon name or ID",
            required: true,
            className: "search-input"
        }),
        React.createElement("button", { type: "submit", disabled: isLoading, className: "search-button" },
            isLoading ? "Searching..." : "Search"
        )
    );
};

const App = () => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPokemon = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            setError(error.message);
            setPokemon(null);
        }
        setLoading(false);
    };

    return React.createElement("div", { className: "container" },
        React.createElement("h1", null, "Pokémon Search"),
        React.createElement(SearchForm, { onSearch: fetchPokemon, isLoading: loading }),
        error && React.createElement("p", { className: "error" }, error),
        !error && React.createElement(PokemonCard, { pokemon: pokemon })
    );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));