const { Client, Intents } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});
const { token } = require('./config.json');
const { nya } = require(`./uwu`);
const path = resolve(__dirname, "commands");
client.commands = nya(path);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Slash Command smh`);
});

/* Defining helper functions under client.
client.helpers = {};
const helperFiles = fs.readdirSync('./helpers').filter(file => file.endsWith('.js'));

for (const file of helperFiles) {
  const helper = require(`./helpers/${file}`);
  const helperName = file.split('.js')[0]
  client.helpers[helperName] = helper;
  console.log(`${helperName} - Helper loaded!`);
}
idk whats this 
*/

//Slash Go brr
client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName);
	try {
		command.execute(client, interaction);
	}
	catch (err){
		console.log(err);
	}
});


client.login(token);
