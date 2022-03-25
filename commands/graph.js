const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);
const fs = require('fs');
let filesToBeUploaded = []
module.exports.info = {
  "title" : localization.commands.graph.title,
  "name" : localization.commands.graph.name,
  "color" : localization.commands.graph.color,
}

module.exports.execute = async (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  //check the graph mtime
  fs.stat(config.graph_path, (err, stats) => {
    let currentGraphMTime;
    if (err) {
      //no graph found
      embed.addField('graph',`under maintenance`)
      message.channel.send({embeds: [embed]});
    } else {
      //graph found
      currentGraphMTime = stats.mtime.toISOString();
      console.log(`DEBUG: File Data Last Modified: ${stats.mtime}`);
      //send embed message
      let filesToBeUploaded = []
      if (!client.lastGraph || client.lastGraph.mtime !== currentGraphMTime) {
        // Last photo expired we need a new one.
        console.log(`DEBUG: Last graph expired, uploading new one.`);
        embed.setImage(`attachment://${config.graph_path.split('/').reverse()[0]}`);
        filesToBeUploaded = [config.graph_path]
      } else {
        console.log(`DEBUG: Using graph from cache.`);
        embed.setImage(client.lastGraph.url)
      }
      message.channel.send({embeds: [embed], files: filesToBeUploaded})
        .then(message => {
          if (message.embeds[0].image && filesToBeUploaded.length > 0) {
            // Updating last graph data.
            console.log(`DEBUG: Updating lastGraph`);
            const picName = message.embeds[0].image.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
            client.lastGraph = {
              'name': picName[0],
              'url': message.embeds[0].image.url,
              'mtime': currentGraphMTime
            }
          }
        });
    }
  });
}