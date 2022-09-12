const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const { User } = require("../utils/schemas")

const localization = require('../localization/' + config.localization_file);


module.exports.info = {
    "title" : localization.commands.wallet.title,
    "name" : localization.commands.wallet.name,
    "desc" : localization.commands.wallet.desc,
    "color" : localization.commands.wallet.color
  }

  module.exports.execute = (client, message, args) => {
    
    user = message.author;
    const userData = User.findOne({ id: user.id } || new User({ id: user.id }));

    const embed = new MessageEmbed()
    .setTitle(`${user.username}${this.info.title}`)
    .setColor(this.info.color)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addField(`${this.info.title}, **\` ${userData.wallet} 💵 \`**`, true)
    .setFooter({
        text: message.member.displayName,
        iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

    message.channel.send({ embeds: [embed] });
  };
  