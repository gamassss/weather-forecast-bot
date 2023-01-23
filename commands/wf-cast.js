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
		let latitude = city.results[0].latitude
		let longitude = city.results[0].longitude
		await interaction.reply(`Nama kota: ${cityName} lat: ${latitude}, long: ${longitude}`);
	},
};