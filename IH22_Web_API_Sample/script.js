document.addEventListener('DOMContentLoaded', () => {
    const pokemonListDiv = document.getElementById('pokemonList');
    const kantoButton = document.getElementById('kantoButton');
    const johtoButton = document.getElementById('johtoButton');
    const hoennButton = document.getElementById('hoennButton');

    // 各地方のポケモンの範囲を定義 (offsetはAPIの開始地点、limitは取得数)
    const regions = {
        kanto: { offset: 0, limit: 151 },      // カントー地方 (No.1-151)
        johto: { offset: 151, limit: 100 },    // ジョウト地方 (No.152-251)
        hoenn: { offset: 251, limit: 135 }     // ホウエン地方 (No.252-386)
        // 必要に応じて他の地方も追加
    };

    /**
     * ポケモンデータを取得し、画面に表示する関数
     * @param {number} offset - 取得開始位置
     * @param {number} limit - 取得するポケモンの数
     */
    async function fetchAndDisplayPokemons(offset, limit) {
        pokemonListDiv.innerHTML = '読み込み中...'; // 読み込み中の表示
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('APIからのデータ:', data);

            pokemonListDiv.innerHTML = ''; // 既存の表示をクリア

            for (const pokemon of data.results) {
                // 各ポケモンの詳細データを取得 (画像URLのため)
                const pokemonDetailResponse = await fetch(pokemon.url);
                if (!pokemonDetailResponse.ok) {
                    console.error(`Failed to fetch detail for ${pokemon.name}`);
                    continue;
                }
                const pokemonDetail = await pokemonDetailResponse.json();

                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card');

                const pokemonImage = document.createElement('img');
                // front_defaultはポケモンの正面の通常画像
                pokemonImage.src = pokemonDetail.sprites.front_default;
                pokemonImage.alt = pokemon.name;

                const pokemonName = document.createElement('p');
                pokemonName.textContent = pokemon.name;

                pokemonCard.appendChild(pokemonImage);
                pokemonCard.appendChild(pokemonName);
                pokemonListDiv.appendChild(pokemonCard);
            }
        } catch (error) {
            console.error('データの取得中にエラーが発生しました:', error);
            pokemonListDiv.innerHTML = '<p>データの取得に失敗しました。時間をおいてお試しください。</p>';
        }
    }

    // ボタンにイベントリスナーを設定
    kantoButton.addEventListener('click', () => {
        fetchAndDisplayPokemons(regions.kanto.offset, regions.kanto.limit);
    });

    johtoButton.addEventListener('click', () => {
        fetchAndDisplayPokemons(regions.johto.offset, regions.johto.limit);
    });

    hoennButton.addEventListener('click', () => {
        fetchAndDisplayPokemons(regions.hoenn.offset, regions.hoenn.limit);
    });

    // 初回表示はカントー地方のポケモンを表示
    fetchAndDisplayPokemons(regions.kanto.offset, regions.kanto.limit);
});