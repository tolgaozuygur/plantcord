const { Client, Intents, Collection } = require('discord.js');
const fs = require("fs");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});
client.config = require('./config.json');
client.commands = new Collection();
client.helpers = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${client.config.prefix}help`);
});

// Defining helper functions under client.
const helperFiles = fs.readdirSync('./helpers').filter(file => file.endsWith('.js'));

for (const file of helperFiles) {
  const helper = require(`./helpers/${file}`);
  const helperName = file.split('.js')[0]
  client.helpers[helperName] = helper;
  console.log(`${helperName} - Helper loaded!`);
}

// COMMAND HANDLER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Reading each command file and defining under client.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.info.name, command);
  console.log(`${command.info.name} - Command loaded!`);
}

client.on('messageCreate', async (message) => {
  if (client.config.specific_channel_for_bot_to_be_used_on === "yes") {
    if (message.channel.id !== client.config.specific_channel_id_for_bot_to_be_used_on) return;
  }
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;
  const commandBody = message.content.slice(client.config.prefix.length);
  const args = commandBody.split(' ');
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) {
    return await message.reply({ content: 'This command does not exists.' })
  }

  await command.execute(client, message, args);
});

client.login(client.config.bot_token);
