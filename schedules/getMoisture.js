schedule = require("node-schedule");
fs = require("fs");
module.exports.execute = (client) => {
    schedule.scheduleJob(client.helpers.secToCron(client.config.channel_rename_interval), function(){
        getMoistureAndSave(client)
        console.log(client.helpers.arduinoBridge.getMoisture());
    });
}

function getMoistureAndSave(client){
    moisture_data = client.helpers.arduinoBridge.getMoisture();
    fs.writeFile('./moisture_data.csv', Date.now()+","+moisture_data+"\n", { flag: "a+" }, (err) => {
    if (err) throw err;
    }); 
}