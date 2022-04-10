const { Client, Intents, Collection } = require('discord.js');
const fs = require("fs");
const { setInterval } = require('timers');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});
client.config = require('./config.json');
client.localization = require('./localization/'+client.config.localization_file);

client.commands = new Collection();
client.schedule = new Collection();
client.helpers = {};
client.lastPhoto = {};
client.lastGraph = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Defining helper functions under client.
const helperFiles = fs.readdirSync('./helpers').filter(file => file.endsWith('.js'));

for (const file of helperFiles) {
  const helper = require(`./helpers/${file}`);
  const helperName = file.split('.js')[0]
  client.helpers[helperName] = helper;
  console.log(`${helperName} ${client.localization.console_logs.helper_loaded}`);
}

// COMMAND HANDLER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Reading each command file and defining under client.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.info.name, command);
  console.log(`${command.info.name} ${client.localization.console_logs.command_loaded}`);
}

// Defining schedule functions under client.
const scheduleFiles = fs.readdirSync('./schedules').filter(file => file.endsWith('.js'));

for (const file of scheduleFiles) {
  const schedule = require(`./schedules/${file}`);
  const scheduleName = file.split('.js')[0]
  client.schedule.set(scheduleName, schedule);
  console.log(`${scheduleName} ${client.localization.console_logs.schedule_loaded}`);
}

client.on('messageCreate', async (message) => {
  if (client.config.spesific_channel === "yes") {
    if (message.channel.id !== client.config.channel_id) return;
  }
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) {
    message.delete()
  } else {
    const commandBody = message.content.slice(client.config.prefix.length);
    const args = commandBody.split(' ');
    if (args.length > 3) {
      message.delete()
    };
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) {
      message.delete()
      return await message.reply({ content: client.localization.commands.not_found}).then(message => message.delete({timeout:"5000"}));
    }

    await command.execute(client, message, args);
  }
});

client.login(client.config.bot_token).then(()=>{

  client.schedule.forEach(f=>{
    f.execute(client);
  })
});
