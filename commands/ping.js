const wait = require('util').promisify(setTimeout);
const {MessageEmbed} = require("discord.js");
const localization = require('../localization.json');

module.exports.info = {
  "title" : localization.commands.ping.title,
  "name" : localization.commands.ping.name,
  "desc" : localization.commands.ping.desc,
  "color" : localization.commands.ping.color,
  "field" : localization.commands.ping.field,
}


module.exports = {
	name: "ping",
	description: "Ping stuff",
	async execute(client, interaction) {
		try {
      let pcMsg = new Date();
		
      function msToTime(ms) {
			  let days = Math.floor(ms / 86400000);
			  let daysms = ms % 86400000;
			  let hours = Math.floor(daysms / 3600000);
			  let hoursms = ms % 3600000;
			  let minutes = Math.floor(hoursms / 60000);
			  let minutesms = ms % 60000;
			  let sec = Math.floor(minutesms / 1000);
		
			  let str = "";
			  if (days) str = str + days + "d ";
			  if (hours) str = str + hours + "h ";
			  if (minutes) str = str + minutes + "m ";
			  if (sec) str = str + sec + "s";
		
			  return str;
		  }

		  interaction.reply("Pinging");
		  await wait(1000)

		  const Embed = new MessageEmbed()
        .setColor(this.info.color)
        .setTitle("Ping")
			  .addFields(
				  {name: "**Server**:", value: `${(pcMsg - interaction.createdAt)} ms`},
				  {name: "**API**:", value: `${Math.round(client.ws.ping)} ms`},
				  {name: "**Uptime**:", value: `${msToTime(client.uptime)}`},
			  )

		  await interaction.editReply({ embeds: [Embed] });	    
    } catch (error) {
      interaction.reply({content:"https://dar.vin/bgKXe"});
    }
    
	},
};