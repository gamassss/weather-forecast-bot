const { SlashCommandBuilder } = require('discord.js');
const { weather_map, rainCode } = require('../wmo-code')
// const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Replies weather forecast.')
		.addStringOption(option =>
			option
				.setName('city')
				.setDescription('The choosen city name')
				.setRequired(true)),
	async execute(interaction) {
		const cityName = interaction.options.getString('city') ?? 'No city choosen';
		// let latitude, longtitude;
		async function loadCity() {
			const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
			return response.json();
		}

		let city = await loadCity()
		// let results = city.results ?? []
		/* get first instance of city from search query */
		let latitude = city.results[0].latitude
		let longitude = city.results[0].longitude

		const event = new Date();
		const todayDate = event.toLocaleDateString('en-GB');
		const nowTime = event.toLocaleTimeString();

		const dateFormat = todayDate.split('/');
		const date = dateFormat.reverse().join('-');
		const currentTime = nowTime.split('.')

		if (currentTime.includes('0')) {
			currentTime = currentTime[0][1];
		}

		const index = parseInt(currentTime);

		let url = (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${date}&end_date=${date}`)

		async function loadForecast() {
			const result = await fetch(url);
			return result.json();
		}

		let forecastData = await loadForecast();
		const { hourly } = forecastData
		// let stringJSON = JSON.stringify(hourly)
		const { time, temperature_2m, weathercode, windspeed_10m, winddirection_10m } = hourly;
		const strWMO = weathercode[index].toString()
		let rainDescription = '';

		if (rainCode.includes(strWMO)) {
			rainDescription = weather_map.get(strWMO)
		} else {
			rainDescription = 'Happy no rain day :)'
		}


		await interaction.deferReply({ ephemeral: false });
		await interaction.editReply(`Jam: ${time[index]}\n
		Suhu: ${temperature_2m[index]}\n
		CodeWMO: ${weathercode[index]}\n
		Deskripsi cuaca: ${rainDescription}\n
		Wind speed: ${windspeed_10m[index]}\n
		Wind direction:${winddirection_10m[index]}`)
	},
};