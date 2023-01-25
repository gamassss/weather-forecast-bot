const { SlashCommandBuilder } = require('discord.js');

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
		const time = nowTime.split('.')

		if (time.includes('0')) {
			time = time[0][1];
		}

		const index = parseInt(time);

		let url = (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${date}&end_date=${date}`)

		async function loadForecastJSON() {
			const response = await fetch(url);
			return response.json();
		}

		const forecastData = await loadForecastJSON();

		await interaction.reply(`Nama kota: ${cityName} lat: ${latitude}, long: ${longitude}. tanggal = ${date}, jam = ${time}, index = ${index}`);
	},
};