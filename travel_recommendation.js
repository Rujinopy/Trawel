document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');
    searchButton.addEventListener('click', handleSearch);
    resetButton.addEventListener('click', clearResults);
});

async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const displayPanel = document.getElementById('displayPanel');
    const keyword = searchInput.value.toLowerCase().trim();

    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        
        let results = [];

        // Check for category keywords
        if (keyword === 'beach' || keyword === 'beaches') {
            results = data.beaches;
        } else if (keyword === 'temple' || keyword === 'temples') {
            results = data.temples;
        } else if (keyword === 'country' || keyword === 'countries') {
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } else {
            //not a category, search by name across all items
            
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        results.push(city);
                    }
                });
            });

            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(keyword)) {
                    results.push(temple);
                }
            });

            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(keyword)) {
                    results.push(beach);
                }
            });
        }

        displayResults(results);

    } catch (error) {
        console.error(error);
    }
}


function displayResults(results) {
    const displayPanel = document.getElementById('displayPanel');
    displayPanel.innerHTML = ''; 

    if (results.length === 0) {
        displayPanel.innerHTML = '<li style="color: white;">No results found.</li>';
        return;
    }

    results.forEach(item => {
        const li = document.createElement('li');
        li.style.color = 'white'; 
        li.style.marginBottom = '15px'; 

        li.innerHTML = `
            <img src=${item.imageUrl} alt=${item.name} width="200">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;
        
        displayPanel.appendChild(li);
    });
}

function clearResults() {
    const displayPanel = document.getElementById('displayPanel');
    displayPanel.innerHTML = '';
    
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
}