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
const localization = require('./localization/'+client.config.localization_file);
const change = require('./changeChannelNameAndActivity.js');
client.commands = new Collection();
const schedule = require('node-schedule');
const NodeWebcam = require("node-webcam");
var is_there_vc;
client.helpers = {};
client.lastPhoto = {};

client.on('ready', () => {
  // Channel
  if(client.config.auto_change_voice_channel_name === "yes"){
    if(client.config.voice_channel_id !== ""){
      client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
          if(channel.id === client.config.voice_channel_id){
            is_there_vc = 1;
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { CONNECT: false});
          }
        });
      });
    }
    else{
      is_there_vc = 0;
    }
    if(is_there_vc !== 1){
      if(client.config.guild_id !== ""){
        guild.id.channels.create('Rename me', { type: 'voice' }).then(channel => {
          client.config.voice_channel_id = channel.id;
          fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 2));
          channel.permissionOverwrites.create(channel.guild.roles.everyone, { CONNECT: false});
        });
      }
    }
    if(is_there_vc === 1){
      schedule.scheduleJob('*/10 * * * *', function(){
        console.log("channelName updated");
        if (client.config.auto_change_voice_channel_name === "yes") {
          change(client,` ${localization.commands.water.field} : ${client.helpers.getMoisture()}`)
        }
      });
    }
  }
  // Channel end

  console.log(`Logged in as ${client.user.tag}!`);


});

// Defining helper functions under client.
const helperFiles = fs.readdirSync('./helpers').filter(file => file.endsWith('.js'));

for (const file of helperFiles) {
  const helper = require(`./helpers/${file}`);
  const helperName = file.split('.js')[0]
  client.helpers[helperName] = helper;
  console.log(`${helperName} ${localization.console_logs.helper_loaded}`);
}

// COMMAND HANDLER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Reading each command file and defining under client.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.info.name, command);
  console.log(`${command.info.name} ${localization.console_logs.command_loaded}`);
}

client.on('messageCreate', async (message) => {
  if (client.config.spesific_channel === "yes") {
    if (message.channel.id !== client.config.channel_id) return;
  }
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;
  const commandBody = message.content.slice(client.config.prefix.length);
  const args = commandBody.split(' ');
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) {
    return await message.reply({ content: localization.commands.not_found});
  }

  await command.execute(client, message, args);
});

client.login(client.config.bot_token);

// Take picture of the plant with a certain interval
function takePicture() {
  var FSWebcam = NodeWebcam.FSWebcam;
  var opts = {
    rotation:client.config.photo_rotation,
    quality:80,
    width:client.config.photo_width,
    height:client.config.photo_height,
    output:client.config.photo_ftype
  };
  var webcam = new FSWebcam( opts );
  webcam.capture(client.config.photo_path, function ( err, data ) {} );
  console.log('Took a new picture of the plant!');
}
takePicture();
setInterval(takePicture, client.config.photo_update_interval);
