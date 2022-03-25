var is_there_vc;
schedule = require("node-schedule");
module.exports.execute = (client) => {
    if(client.config.auto_change_voice_channel_name === "yes"){
        schedule.scheduleJob(client.helpers.secToCron(client.config.channel_rename_interval), function(){
            client.channels.cache.get(client.config.voice_channel_id).setName(` ${client.localization.commands.water.field} : ${client.helpers.getMoisture()}`);
        });
    }
}
