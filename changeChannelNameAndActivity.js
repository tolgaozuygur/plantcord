module.exports = (client, channelName) => {
    client.user.setActivity(`${client.config.plant_name} - ${channelName}`);
    client.channels.cache.get(client.config.voice_channel_id).setName(channelName);
}