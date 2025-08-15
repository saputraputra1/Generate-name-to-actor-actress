document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const nameInput = document.getElementById('name');
    const genderSelect = document.getElementById('gender');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    const errorMessage = document.getElementById('error-message');

    // Fallback avatar SVG, using a simple design
    const fallbackAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='40' fill='%23888' text-anchor='middle'%3E%3Ft%3C/text%3E%3C/svg%3E";

    let celebrityDataset = [];

    // Fetch the celebrity data
    async function loadData() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            celebrityDataset = await response.json();
        } catch (e) {
            console.error("Gagal memuat data jodoh:", e);
            errorMessage.textContent = "Maaf, gagal memuat data. Coba muat ulang halaman.";
            errorMessage.style.display = 'block';
        }
    }

    // Display the match
    function displayMatch(match) {
        resultsGrid.innerHTML = ''; // Clear previous results
        noResults.style.display = 'none';
        resultsContainer.classList.remove('visible'); // Hide while updating

        const card = document.createElement('div');
        card.className = 'celebrity-card';

        const imageUrl = fallbackAvatar;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${match.full_name}" class="celebrity-image">
            <div class="celebrity-details">
                <h3 class="celebrity-name">${match.full_name}</h3>
                <p class="celebrity-profession">Kategori: ${match.category}</p>
                <p class="celebrity-country">Asal: ${match.country}</p>
                <p class="celebrity-birth-year">Tahun Lahir: ${match.birth_year}</p>
            </div>
        `;

        resultsGrid.appendChild(card);
        // Use a tiny timeout to allow the DOM to update before triggering the animation
        setTimeout(() => {
            resultsContainer.classList.add('visible');
        }, 10);
    }

    // Find a match
    function findMatch() {
        const userName = nameInput.value.trim();
        const userGender = genderSelect.value;

        if (!userName) {
            errorMessage.style.display = 'block';
            resultsContainer.classList.remove('visible');
            noResults.style.display = 'none';
            return;
        }

        errorMessage.style.display = 'none';

        const targetGender = userGender === 'male' ? 'female' : 'male';

        const potentialMatches = celebrityDataset.filter(person => person.gender === targetGender);

        if (potentialMatches.length > 0) {
            const randomIndex = Math.floor(Math.random() * potentialMatches.length);
            const match = potentialMatches[randomIndex];
            displayMatch(match);
        } else {
            resultsContainer.classList.remove('visible');
            noResults.style.display = 'block';
        }
    }

    // Event Listeners
    searchBtn.addEventListener('click', findMatch);

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            findMatch();
        }
    });

    // Load data on page start
    loadData();
});
