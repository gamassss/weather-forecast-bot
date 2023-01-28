const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

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

		const weather_map = new Map([
			['0', 'Clear sky'],
			['1', 'Mainly clear'],
			['2', 'Partly cloudy'],
			['3', 'Overcast'],
			['45', 'Fog'],
			['48', 'Depositing rime fog'],
			['51', 'Drizzle light'],
			['53', 'Drizzle moderate'],
			['55', 'Drizzle dense intensity'],
			['56', 'Freezing drizzle light'],
			['57', 'Freezing drizzle dense intensity'],
			['61', 'Rain slight'],
			['63', 'Rain moderate'],
			['65', 'Rain heavy intensity'],
			['66', 'Freezing rain light'],
			['67', 'Freezing rain heavy intensity'],
			['71', 'Snow fall slight'],
			['73', 'Snow fall moderate'],
			['75', 'Snow fall heavy intensity'],
			['77', 'Snow grains'],
			['80', 'Rain showers slight'],
			['81', 'Rain showers moderate'],
			['82', 'Rain showers violent'],
			['85', 'Snow showers slight'],
			['86', 'Snow showers heavy'],
			['95', 'Thunderstorm slight or moderate'],
			['96', 'Thunderstorm with slight'],
			['99', 'Thunderstorm with heavy hail'],
		])

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
		let stringJSON = JSON.stringify(hourly)
		const { time, temperature_2m, weathercode, windspeed_10m, winddirection_10m } = hourly;
		const strWMO = weathercode[index].toString()
		const rainDescription = '';
		const rainCode = ['61', '63', '65', '66', '67', '80', '81', '82', '85', '86', '95', '96', '99'];

		if (weather_map.has('3')) {
			console.log(`${strWMO} pong!`)
		}


		await interaction.deferReply({ ephemeral: false });
		await interaction.editReply(`${time[index]} ${temperature_2m[index]} ${weathercode[index]} ${windspeed_10m[index]} ${winddirection_10m[index]} \n${stringJSON}`)
	},
};