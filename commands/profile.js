const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const User = require("../utils/user");

const localization = require('../localization/' + config.localization_file);


module.exports.info = {
    "title" : localization.commands.profile.title,
    "name" : localization.commands.profile.name,
    "desc" : localization.commands.profile.desc,
    "color" : localization.commands.profile.color,
    "windCount" : localization.commands.profile.windCount,
    "waterCount" : localization.commands.profile.waterCount
  }

module.exports.execute = (client, message, args) => {

    user = message.author;
    User.findOne({ id: user.id }).then((result) => {
        if (!result) {
            const newUser = new User({
                id: user.id,
                waterCount: 0,
                windCount: 0
            });
            newUser.save();
        }
    });
    User.findOne({ id: user.id }).then((result) => {
        const embed = new MessageEmbed()
            .setTitle(`${user.username}${this.info.title}`)
            .setColor(this.info.color)
            .addFields(
                {value: '```'+`${result.waterCount.toString()}`+'```', name: `${this.info.waterCount}💧`, inline: true},
                {value: '```'+`${result.windCount.toString()}`+'```', name: `${this.info.windCount}💨`, inline: true}
            )
            .setFooter({
                text: message.member.displayName,
                iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    });
  };
