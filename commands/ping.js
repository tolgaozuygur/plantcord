const {MessageEmbed} = require("discord.js");

module.exports.info = {
  "title" : "Pong! 🏓",
  "name" : "ping",
  "desc" : "Ping-pong",
  "color" : "YELLOW",
  "field" : "API Latency"
}

module.exports.execute = (client, message) => {
  const apiLatency = Math.round(message.client.ws.ping);
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .addField(this.info.field,`${apiLatency}ms`)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
}
