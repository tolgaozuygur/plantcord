var is_there_vc;
schedule = require("node-schedule");
module.exports.execute = (client) => {
	if (client.config.auto_change_voice_channel_name === "yes") {
		if(!client.config.voice_channel_id) return console.error("It looks like you have forgotten to specify a voice channel for the bot. Please try again with the voice channel ID in the config or set 'autoc_change_voice_channel_name' to 'no'")
		schedule.scheduleJob(client.helpers.secToCron(client.config.channel_rename_interval), function () {
			client.channels.cache.get(client.config.voice_channel_id).setName(`└─${client.localization.commands.water.moisture}: %${client.helpers.arduinoBridge.getMoisture()}`);
		});
	}
}
