const { SlashCommandBuilder } = require('discord.js');
const { weather_map, rainCode } = require('../wmo-code')
// const wait = require('node:timers/promises').setTimeout;

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
		// let latitude, longtitude;
		async function loadCity() {
			const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
			return response.json();
		}
		// console.log(await loadCity())
		const city = await loadCity()
		// console.log(city)
		const { results } = city ?? []
		/* get first instance of city from search query */
		const latitude = results[0].latitude
		const longitude = results[0].longitude
		// console.log(`lat: ${latitude}, long: ${longitude}`)
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

		let url = (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${date}&end_date=${date}`)

		async function loadForecast() {
			const result = await fetch(url);
			return result.json();
		}

		let forecastData = await loadForecast();
		const { hourly } = forecastData
		const { time, temperature_2m, weathercode, windspeed_10m, winddirection_10m } = hourly;
		const strWMO = weathercode[index].toString()
		let rainDescription = '';

		if (rainCode.includes(strWMO)) {
			rainDescription = weather_map.get(strWMO)
		} else {
			rainDescription = 'Happy no rain day :)'
		}
		const [ , jam ] = time[index].split('T')

		const embed = {
			title: "Weather Forecast" ,
			color: 0xF96221,
			thumbnail: {
				"url": "attachment://weather-icon-for-bot.png"
			},
			fields: [
				{
					name: "Daily Weather Forecast Update in Your Area",
					value: "",
					inline: false
				},
				{
					name: "When is rain?",
					value: "Two",
					inline: true,
				},
				{
					name: "Current Temperature",
					value: "Two",
					inline: true,
				},
				{
					name:"Wind",
					value:"Three",
					inline: true
				},
			],
			"footer": {
				"text":`By using this service, you agreed to our Terms and Service.`
			}
		};

		// await interaction.deferReply({ ephemeral: false });
		await interaction.reply({ embeds: [embed], files: [{
			attachment:'img/weather-icon-for-bot.png',
			name:'weather-icon-for-bot.png'
		}] })
	},
};