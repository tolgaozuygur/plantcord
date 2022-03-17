const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const config = require('./config.json');
const prefix = config.prefix;

function getMoisture() {
  ///getting moisture...
  moisture = Math.random().toFixed(2);
  console.log(moisture);
  return moisture;
}

function waterTheFlower() {
  return 1;
}

function getAllCommands(){
  let commands= Object.values(config.commands);
  let commandList  = [];
  commands.forEach(com=>{
    commandList.push({name : com , value : config.answers[com].desc})
  })
  return commandList;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let commandBody = message.content.slice(prefix.length);
  let args = commandBody.split(' ');
  let command = args.shift().toLowerCase();

  switch (command) {
    case config.commands.ping: {
      const apiLatency = Math.round(message.client.ws.ping);
      const embed = new MessageEmbed()
        .setTitle(config.answers.ping.title)
        .setColor(config.answers.ping.color)
        .addField(config.answers.ping.field,`${apiLatency}ms`)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
      break;
    }

    case config.commands.uptime: {
      // client.uptime is in millseconds
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      const embed = new MessageEmbed()
        .setTitle(config.answers.uptime.title)
        .setColor(config.answers.uptime.color)
        .addField(config.answers.uptime.field,`${days}d ${hours}h ${minutes}m ${seconds}s`)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
      break;
    }

    case config.commands.water: {
      const embed = new MessageEmbed()
        .setTitle(config.answers.water.title)
        .setColor(config.answers.water.color)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();
      if(config.answers.water.field){
        embed.addField(config.answers.water.field, `${getMoisture()}%`)
      }

      message.channel.send({ embeds: [embed] });
      break;
    }

    case config.commands.photo: {
      const embed = new MessageEmbed()
        .setTitle(config.answers.photo.title)
        .setColor(config.answers.photo.color)
        .setImage(
          'attachment://example.png',
        )
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed], files: [config.answers.photo.photo_path]  });
      break;
    }

    default : {
      const embed = new MessageEmbed()
        .setTitle(config.answers.default.title)
        .setColor(config.answers.default.color)
        .addFields(
          getAllCommands()
        )
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
      break;
    }
  }
});

client.login(config.bot_token);
