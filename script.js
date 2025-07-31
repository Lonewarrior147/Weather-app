const citySearchInput = document.getElementById('city-search');
const searchButton = document.getElementById('search-button');
const cityNameDisplay = document.querySelector('.city-name');
const humidityDisplay = document.querySelector('.humidity-val');
const aqiDisplay = document.querySelector('.aqi-val'); // Corrected: .aqi-val (hyphen)
const temperatureDisplay = document.querySelector('.temperature');

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

console.log("Script is running!");
console.log("citySearchInput element on load:", citySearchInput); // For initial check of the input element

async function fetchWeatherData(city){
    try{
        // Step 1: Geocoding - Convert city name to coordinates
        const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geocodingData = await geocodingResponse.json();
        console.log("Geocoding data received:", geocodingData); // Log geocoding response

        if (!geocodingData.results || geocodingData.results.length === 0) {
            alert('City not found. Please try again.');
            return;
        }

        const { latitude, longitude, name, country } = geocodingData.results[0];
        console.log(`Geocoded: ${name}, ${country} (Lat: ${latitude}, Lon: ${longitude})`); // Log extracted coordinates

        // Step 2: Fetch weather forecast using the obtained coordinates
        // MODIFICATION HERE: Removed 'pm10' from hourly parameters
        const weatherApiUrl = `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&forecast_days=1&hourly=relative_humidity_2m`; // Removed ',pm10'
        console.log("Fetching weather from URL:", weatherApiUrl); // Log the full weather API URL

        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();
        console.log("Weather data received:", weatherData); // Log the full weather data response

        if (!weatherData.current_weather) {
            console.error('API response missing current_weather data. Full response:', weatherData);
            alert('Could not retrieve current weather data for this location. Please try another city or check the console for details.');
            return; // Exit if current_weather is not available
        }

        // Extract relevant weather information
        const temperature = weatherData.current_weather.temperature;
        const humidity = weatherData.hourly.relative_humidity_2m[0];
        // MODIFICATION HERE: pm10 might not be available now, so default to 'N/A'
        // If you specifically need AQI, you might need a separate API call or a different Open-Meteo endpoint.
        const pm10 = 'N/A'; // Since we are not requesting pm10, set it to N/A or handle its absence

        // Update the HTML elements with the fetched data
        cityNameDisplay.textContent = `${name}, ${country}`;
        temperatureDisplay.textContent = `${temperature}°C`;
        humidityDisplay.textContent = `Humidity - ${humidity}%`;
        aqiDisplay.textContent = `AQI - ${pm10}`; // Updated: directly use pm10 (which is 'N/A' for now)
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data. Please try again later.');
    }
}

searchButton.addEventListener('click', () => {
    console.log("citySearchInput value on click:", citySearchInput.value);
    const city = citySearchInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

fetchWeatherData('Thiruporur');