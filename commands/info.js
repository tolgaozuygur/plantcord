const {MessageEmbed} = require("discord.js");
const localization = require('../localization.json');
const config = require('../config.json');
const schedule = require('node-schedule');
let MS_Per_Day = 1000 * 60 * 60 * 24;

module.exports.info = {
  "title" : localization.commands.info.title,
  "name" : localization.commands.info.name,
  "desc" : localization.commands.info.desc,
  "color" : localization.commands.info.color,
  "field1" : localization.commands.info.field1,
  "field2" : localization.commands.info.field2,
  "time_field" : localization.commands.info.time_field
}


function dateDiff(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_Per_Day);
}


var d_water_count = 0 //günlük sulama sayısı
var w_water_count = 0 //haftalık sulama sayısı
var a_water_count = 0 //tüm zamanlar sulama sayısı

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

  var d_avg = getAverage(d_humidity)
  var w_avg = getAverage(w_humidity)
  var a_avg = getAverage(a_humidity)
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
            "name": this.info.field1,
            "value": "Günlük: "+ d_water_count + "\nHaftalık: " + w_water_count + "\nTüm Zamanlar: " + a_water_count,
            "inline": false
          },
          {
            "name": this.info.field2,
            "value": "Günlük: "+ d_avg + "\nHaftalık: " + w_avg + "\nTüm Zamanlar: " + a_avg,
            "inline": true
          },
          {
            "name": `Deney Uzunluğu`,
            "value": `${difference}` + `${this.info.time_field}`,
            "inline": false
          })
  message.channel.send({ embeds: [embed] });

const hourly_job = schedule.scheduleJob('*/1 * * * *', function(){
  console.log("works");
  d_humidity.push(client.helpers.getMoisture())
  w_humidity.push(client.helpers.getMoisture())
  a_humidity.push(client.helpers.getMoisture())
});

}