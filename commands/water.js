const { MessageEmbed } = require("discord.js");
const localization = require('../localization.json');

module.exports.info = {
  "title" : localization.commands.water.title,
  "name" : localization.commands.water.name,
  "desc" : localization.commands.water.desc,
  "color" : localization.commands.water.color,
  "field" : localization.commands.water.field
}
module.exports = {
	name: "water",
	description: "Water stuff",
	async execute(client, interaction) {

    try {
      const moisture = Math.random().toFixed(2);
      const wembed = new MessageEmbed()
				.setColor(this.info.color)
				.setTitle(this.info.title)
      if(this.info.field) embed.addField(this.info.field, `${moisture}%`)
      console.log(moisture)
			interaction.reply({ embeds: [wembed] });	
    } catch (error) {
      interaction.reply({content:"Ewwow"});
    }
	},
};