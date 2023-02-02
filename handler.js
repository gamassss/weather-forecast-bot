async function loadForecast(url) {
	const result = await fetch(url);
	return result.json();
}

async function loadCity(urlGeo) {
	const response = await fetch(urlGeo);
	return response.json();
}

module.exports = { loadCity, loadForecast }