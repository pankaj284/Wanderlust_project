const searchBox = document.querySelector("#search-input");
const citesBox = document.querySelector("#cities");
let allCity = [];

let isFetchAllCity = false;

async function fetchCities() {
    if (isFetchAllCity) return;

    try {
        let response = await fetch("/listings/cities", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`we could not fetch the cities!`);
        }

        const listings = await response.json();

        for (let listing of listings) {
            allCity.push(listing.location);
        }

        isFetchAllCity = true;

    } catch (err) {
        console.log(err);
    }
}

function showCities(userText = "") {

    citesBox.innerHTML = "";

    let filteredCities = allCity.filter(city => {
        return city.toLowerCase().includes(userText.toLowerCase())
    })

    if (filteredCities.length === 0) {
        citesBox.style.display = 'none';
        return;
    }


    for (let city of filteredCities) {
        let p = document.createElement("p");
        p.textContent = city;
        p.className = 'city-item'

        p.addEventListener('click', function () {
            searchBox.value = this.textContent;
            citesBox.style.display = 'none';
        })

        citesBox.appendChild(p);
    }

    citesBox.style.display = 'block';
}


searchBox.addEventListener("focus", async function () {
    await fetchCities();
    showCities(searchBox.value);
})

searchBox.addEventListener("input", () => {
    showCities(searchBox.value);
})

document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-container")) {
        citesBox.style.display = 'none';
    }
})