var is_there_vc;
schedule = require("node-schedule");
module.exports.execute = (client) => {
    if(client.config.auto_change_voice_channel_name === "yes"){
        /*
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
            ///TODO : getting error
            guild.id.channels.create('Rename me', { type: 'voice' }).then(channel => {
                client.config.voice_channel_id = channel.id;
                fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 2));
                channel.permissionOverwrites.create(channel.guild.roles.everyone, { CONNECT: false});
            });
            }
        }else{
            
        }
        */
        schedule.scheduleJob('*/1 * * * * *', function(){
            client.channels.cache.get(client.config.voice_channel_id).setName(` ${client.localization.commands.water.field} : ${client.helpers.getMoisture()}`);
        });
    }
}
