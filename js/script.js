document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('user-name');
    const userAgeInput = document.getElementById('user-age');
    const findMatchBtn = document.getElementById('find-match-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');

    let celebrityDataset = [];
    const currentYear = new Date().getFullYear();

    // Calculate age from birth year
    function calculateAge(birthYear) {
        return currentYear - birthYear;
    }

    // Display matches based on user's gender
    function filterAndDisplayMatches(userGender) {
        const oppositeGender = userGender === 'male' ? 'female' : 'male';

        const filteredMatches = celebrityDataset.filter(person => {
            return person.gender === oppositeGender;
        });

        resultsGrid.innerHTML = ''; // Clear previous results

        if (filteredMatches.length > 0) {
            noResults.style.display = 'none';
            resultsContainer.classList.add('visible');

            filteredMatches.forEach(match => {
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
        } catch (e) {
            console.error("Failed to load celebrity data:", e);
            noResults.textContent = "Sorry, failed to load celebrity data. Please refresh the page.";
            noResults.style.display = 'block';
        }
    }

    // Event Listener for the find match button
    findMatchBtn.addEventListener('click', () => {
        const userName = userNameInput.value;
        const userAge = userAgeInput.value;
        const userGender = document.querySelector('input[name="gender"]:checked');

        if (!userName || !userAge || !userGender) {
            alert('Please fill in all fields.');
            return;
        }

        filterAndDisplayMatches(userGender.value);
    });

    // Load data on page start
    loadDataAndInit();
});
