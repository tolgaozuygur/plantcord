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
client.localization = require('./localization/'+client.config.localization_file);
client.water_counter = 0;
client.wind_counter = 0;
client.commands = new Collection();
client.schedule = new Collection();
client.helpers = {};
client.lastPhoto = {};
client.lastGraph = {};
client.fan_speed = 0;

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
  if (client.config.specific_channel === "yes" && message.channel.id !== client.config.channel_id) return;
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(client.config.prefix)) return;

  const commandBody = message.content.slice(client.config.prefix.length);
  const args = commandBody.split(' ');
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) {
    return message.reply({ content: client.localization.commands.not_found});
  }

  await command.execute(client, message, args);
});

client.login(client.config.bot_token).then(() => {

  client.schedule.forEach(f => {
    f.execute(client);
  })

  setInterval(() => {
    decreaseFanSpeed(client)
  }, client.config.fan_decrease_time_interval);

  setInterval(() => {
    sendToArduino(client.fan_speed)
  }, client.config.fan_speed_send_arduino_time_interval);
});


function decreaseFanSpeed(client) {
  if (client.fan_speed>0) {
    client.fan_speed -= 1;
  }
  
}

function sendToArduino(fan_speed){
  client.helpers.arduinoBridge.fanspeed(fan_speed);
}