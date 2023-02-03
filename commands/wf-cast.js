const { SlashCommandBuilder } = require('discord.js');
const { weather_map, rainCode } = require('../wmo-code');
const { loadCity, loadForecast } = require('../handler');

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

		const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`

		const city = await loadCity(urlGeocoding)
		const { results } = city ?? []

		if (!results) {
			await interaction.reply(`Sorry, there is no location with that name.`)
			return;
		}

		/* get first instance of city from search query */
		const latitude = results[0].latitude
		const longitude = results[0].longitude
		const event = new Date();
		const todayDate = event.toLocaleDateString('en-GB', { timeZone: 'Asia/Bangkok' });
		const nowTime = event.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
		const dateFormat = todayDate.split('/');
		const date = dateFormat.reverse().join('-');
		// currentTime untuk menyimpan index
		let [ curIndex ] = nowTime.split(':')

		if (curIndex.includes('0')) {
			curIndex = curIndex[0][1];
		}

		const index = parseInt(curIndex);

		let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,showers,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${date}&end_date=${date}`

		let forecastData = await loadForecast(url);
		const { hourly } = forecastData
		const { time, temperature_2m, showers, weathercode, windspeed_10m, winddirection_10m } = hourly;
		let rainDescription = '';
		
		let indexRainHour = -1

		for (let i = index; i < weathercode.length; i++) {
			if (rainCode.includes(weathercode[i])) {
				indexRainHour = i
				break;
			}
		}
		console.log(`index: ${indexRainHour} ${rainCode.includes(weathercode[18])} ${typeof weathercode[18]}`)
		if (indexRainHour === -1) {
			console.log(`index: ${indexRainHour}`)
			await interaction.reply(`Happy no rain day for ${cityName} :)`)
			return;
		}

		const wmo = weathercode[indexRainHour]
		const [ , jam ] = time[indexRainHour].split('T')
		console.log(`wmoCode: ${wmo}`)
		console.log(`tes: ${rainCode.includes(wmo)} ${typeof wmo} ${wmo} ${indexRainHour}`)
		if (rainCode.includes(wmo) && indexRainHour !== -1) {
			rainDescription = weather_map.get(wmo.toString())
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
					value: `${jam}\n${showers[indexRainHour]} mm\n${rainDescription}`,
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