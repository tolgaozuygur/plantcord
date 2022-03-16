require('dotenv').config(); //initialize dotenv
const fetch = require('node-fetch');
const { Client, Intents, MessageEmbed } = require('discord.js');
const mysql2 = require('mysql2');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function getHumidity(){
    ///getting humidity...
    humidity = Math.random().toFixed(2);
    console.log(humidity);
    return humidity;
}

function water_flower(){
    return 1;
}
client.on('ready', async () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID)
    let channel = guild.channels.cache.get(process.env.CHANNEL_ID)
});

client.on('message', function(message) {
    if (message.content === '!watered') {
        ///watering....
        water_flower();
        message.reply('I gave our flower a drop of water.');
    }
    if (message.content === '!humidity') {
        ///getting humidity....
        message.reply('Humidity : %'+getHumidity());
    }
});

client.login(process.env.CLIENT_TOKEN);



