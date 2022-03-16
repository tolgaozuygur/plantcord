require('dotenv').config();
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
    case 'ping': {
      const apiLatency = Math.round(message.client.ws.ping);
      const pingEmbed = new MessageEmbed()
        .setTitle(`Pong! 🏓`)
        .setColor('RED')
        .addField('API Latency', `${apiLatency}ms`)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [pingEmbed] });
      break;
    }

    case 'uptime': {
      // client.uptime is in millseconds
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      message.channel.send(
        `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`
      );
      break;
    }

    case 'sula': {
      const embed = new MessageEmbed()
        .setTitle(`Bitkiyi suladın! 🌱`)
        .setColor('GREEN')
        .addField('Toprak nemi', `${getMoisture()}%`)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
      break;
    }

    case 'fotoğraf': {
      const embed = new MessageEmbed()
        .setTitle(`Bitkinin şuanki fotoğrafı 📷`)
        .setColor('DARK_BUT_NOT_BLACK')
        .setImage(
          'http://cdn.shopify.com/s/files/1/0047/9730/0847/products/nurserylive-g-graptosedum-species-succulent-plant.jpg?v=1634220770s'
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
