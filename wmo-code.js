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

const rainCode = ['61', '63', '65', '66', '67', '80', '81', '82', '85', '86', '95', '96', '99'];


module.exports = { weather_map, rainCode }