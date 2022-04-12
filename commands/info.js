const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);
const schedule = require('node-schedule');
let MS_Per_Day = 1000 * 60 * 60 * 24;

module.exports.info = {
  "title": localization.commands.info.title,
  "name": localization.commands.info.name,
  "desc": localization.commands.info.desc,
  "color": localization.commands.info.color,
  "field0": localization.commands.info.field0,
  "field1": localization.commands.info.field1,
  "field2": localization.commands.info.field2,
  "field3": localization.commands.info.field3,
  "time_field" : localization.commands.info.time_field
}


function dateDiff(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_Per_Day);
}

var d_humidity = []
var w_humidity = []
var a_humidity = []

function getAverage(array){
  const avg = arr => arr.reduce((acc,v,i,a)=>(acc+v/a.length),0);
  const result = avg(array); 
  return result
}

module.exports.execute = (client, message) => {
  const a = new Date();
  const b = new Date(config.start_date);
  const difference = dateDiff(b, a); 

  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .addFields(
          {
            "name": this.info.field0,
            "value": "%" + client.helpers.arduinoBridge.getMoisture(),
          },
		      {
            "name": this.info.field1,
            "value": "%" + config.moisture_min + " - %" + config.moisture_max,
          },
          {
            "name": this.info.field2,
            "value": client.fan_speed+"%",
          },
          {
            "name": this.info.field3,
            "value": `${difference}` + `${this.info.time_field}`,
          })
  message.channel.send({ embeds: [embed] });

schedule.scheduleJob('*/1 * * * *', function(){
  d_humidity.push(client.helpers.arduinoBridge.getMoisture())
  w_humidity.push(client.helpers.arduinoBridge.getMoisture())
  a_humidity.push(client.helpers.arduinoBridge.getMoisture())
});

}
