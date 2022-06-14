schedule = require("node-schedule");
fs = require("fs");
module.exports.execute = (client) => {
	schedule.scheduleJob(client.helpers.secToCron(client.config.save_counter_interval), function () {
		saveCounter(client)
	});
}
function saveCounter(client) {
	water_counter = client.water_counter;
	wind_counter = client.wind_counter;
	fs.writeFile('./counter_data.csv', "water,wind" + "\n" + water_counter + "," + wind_counter + "\n", {}, (err) => {
		if (err) throw err;
	});
}