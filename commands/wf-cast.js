const { SlashCommandBuilder } = require('discord.js');
const { weather_map, rainCode } = require('../wmo-code')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Replies weather forecast.')
		.addStringOption(option =>
			option
				.setName('locations')
				.setDescription('Choose any location')
				.setRequired(true)),
	async execute(interaction) {
		const cityName = interaction.options.getString('locations') ?? 'No city choosen';
		async function loadCity() {
			const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
			return response.json();
		}
		const city = await loadCity()
		const { results } = city ?? []
		/* get first instance of city from search query */
		const latitude = results[0].latitude
		const longitude = results[0].longitude
		const event = new Date();
		const todayDate = event.toLocaleDateString('en-GB');
		const nowTime = event.toLocaleTimeString();

		const dateFormat = todayDate.split('/');
		const date = dateFormat.reverse().join('-');
		// currentTime untuk menyimpan index
		const [ curIndex ] = nowTime.split(':')

		if (curIndex.includes('0')) {
			curIndex = curIndex[0][1];
		}

		const index = parseInt(curIndex);

		let url = (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,showers,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${date}&end_date=${date}`)

		async function loadForecast() {
			const result = await fetch(url);
			return result.json();
		}

		let forecastData = await loadForecast();
		const { hourly } = forecastData
		const { time, temperature_2m, showers, weathercode, windspeed_10m, winddirection_10m } = hourly;
		const strWMO = weathercode[index].toString()
		let rainDescription = '';

		let indexRainHour = -1
		for (let i = index; i < weathercode.length; i++) {
			if (rainCode.includes(weathercode[i])) {
				indexRainHour = i
				break;
			}
		}
		const [ , jam ] = time[indexRainHour].split('T')

		if (rainCode.includes(strWMO) && indexRainHour !== -1) {
			rainDescription = weather_map.get(strWMO)
		} else {
			rainDescription = 'Happy no rain day :)'
		}

		const exampleEmbed = {
			color: 0xF96221,
			title: 'Weather Forecast',
			description: 'Daily Weather Forecast Update in Your Area',
			thumbnail: {
				url: 'attachment://weather-icon-for-bot.png',
			},
			fields: [
				{
					name: 'When is rain?',
					value: `${jam}\n${showers[indexRainHour]} mm\n${weather_map.get(weathercode[indexRainHour].toString())}`,
					inline: true,
				},
				{
					name: 'Current Temperature',
					value: `${temperature_2m[index]} °C`,
					inline: true,
				},
				{
					name: 'Wind',
					value: `Speed ${windspeed_10m[index]}\nDirection ${winddirection_10m[index]}`,
					inline: true,
				},
			],
			timestamp: new Date().toISOString(),
			footer: {
				text: 'By using this service, you agreed to our Terms and Service',
			},
		};

		await interaction.reply({embeds: [exampleEmbed], files: [{
			attachment:'img/weather-icon-for-bot.png',
			name:'weather-icon-for-bot.png'
		}]})
		
	},
};