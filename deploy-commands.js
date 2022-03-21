const { SlashCommandBuilder} = require('@discordjs/builders');
const { REST } = require ('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientID, token } = require('./.config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping stuff'),
    
    new SlashCommandBuilder()
        .setName('water')
        .setDescription('water stuff'),

    new SlashCommandBuilder()
        .setName('photo')
        .setDescription('photo stuff'),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('help stuff'),
  
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();