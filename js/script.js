document.addEventListener('DOMContentLoaded', () => {
    const minAgeSlider = document.getElementById('min-age');
    const maxAgeSlider = document.getElementById('max-age');
    const minAgeValue = document.getElementById('min-age-value');
    const maxAgeValue = document.getElementById('max-age-value');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');

    let celebrityDataset = [];
    const currentYear = new Date().getFullYear();

    // Calculate age from birth year
    function calculateAge(birthYear) {
        return currentYear - birthYear;
    }

    // Display artists based on age filter
    function filterAndDisplayArtists() {
        const minAge = parseInt(minAgeSlider.value, 10);
        const maxAge = parseInt(maxAgeSlider.value, 10);

        // Update slider value display
        minAgeValue.textContent = minAge;
        maxAgeValue.textContent = maxAge;

        // Ensure minAge is not greater than maxAge
        if (minAge > maxAge) {
            maxAgeSlider.value = minAge;
            maxAgeValue.textContent = minAge;
        }

        const filteredArtists = celebrityDataset.filter(person => {
            const age = calculateAge(person.birth_year);
            return age >= minAge && age <= maxAge;
        });

        resultsGrid.innerHTML = ''; // Clear previous results

        if (filteredArtists.length > 0) {
            noResults.style.display = 'none';
            resultsContainer.classList.add('visible');

            filteredArtists.forEach(match => {
                const card = document.createElement('div');
                card.className = 'celebrity-card';
                const age = calculateAge(match.birth_year);

                card.innerHTML = `
                    <img src="${match.image_url}" alt="${match.full_name}" class="celebrity-image">
                    <div class="celebrity-details">
                        <h3 class="celebrity-name">${match.full_name}</h3>
                        <p class="celebrity-profession">${match.category}</p>
                        <p class="celebrity-country">${match.country}</p>
                        <p class="celebrity-birth-year">Age: ${age}</p>
                    </div>
                `;
                resultsGrid.appendChild(card);
            });
        } else {
            resultsContainer.classList.remove('visible');
            noResults.style.display = 'block';
        }
    }

    // Fetch the celebrity data and initialize
    async function loadDataAndInit() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            celebrityDataset = await response.json();
            filterAndDisplayArtists(); // Initial display
        } catch (e) {
            console.error("Failed to load artist data:", e);
            noResults.textContent = "Sorry, failed to load artist data. Please refresh the page.";
            noResults.style.display = 'block';
        }
    }

    // Event Listeners
    minAgeSlider.addEventListener('input', filterAndDisplayArtists);
    maxAgeSlider.addEventListener('input', filterAndDisplayArtists);

    // Load data on page start
    loadDataAndInit();
});
