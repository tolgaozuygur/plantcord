const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);
const schedule = require('node-schedule');
let MS_Per_Day = 1000 * 60 * 60 * 24;
const Database = require('../Schemas/Database');

module.exports.info = {
  title: localization.commands.info.title,
  name: localization.commands.info.name,
  desc: localization.commands.info.desc,
  color: localization.commands.info.color,
  field0: localization.commands.info.field0,
  field1: localization.commands.info.field1,
  field2: localization.commands.info.field2,
  field3: localization.commands.info.field3,
  time_field: localization.commands.info.time_field,
};

function dateDiff(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_Per_Day);
}

function getAverage(array) {
  const avg = (arr) => arr.reduce((acc, v, i, a) => acc + v / a.length, 0);
  const result = avg(array);
  return result;
}

module.exports.execute = async (client, message) => {
  const a = new Date();
  const b = new Date(config.start_date);
  const difference = dateDiff(b, a);

  let data = await Database.findOne({ Plant: client.config.plant_name });
  let day = await client.helpers.database.getDay(client);

  if (data) {
    let dailywater = 0,
      weeklywater = 0,
      alltimewater = 0,
      dailymoisture = 0,
      weeklymoisture = 0,
      alltimemoisture = 0,
      tempday = 0;
    let waterdays = Object.keys(data.Water);
    let moisturedays = Object.keys(data.Moisture);
    console.log(waterdays + '\n' + moisturedays);

    waterdays.forEach((_day) => {
      let datas = Object.values(data.Water).reduce((x, y) => x + y, 0);
      alltimewater += datas;

      if (day == _day) {
        dailywater += datas;
      }

      if (_day <= 7) {
        weeklywater += datas;
      }
    });

    moisturedays.forEach((_day) => {
      console.log(_day);
      let datas = Object.values(data.Moisture).reduce((x, y) => x + y, 0);
      alltimemoisture += datas;
      tempday++;

      if (day == _day) {
        dailymoisture = datas / data.Hour;
      }

      if (_day1 <= 7) {
        weeklymoisture += datas / (_day * data.Hour);
      }
    });

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
          name: this.info.field1,
          value:
            'Günlük: ' +
            dailywater +
            '\nHaftalık: ' +
            weeklywater +
            '\nTüm Zamanlar: ' +
            alltimewater,
          inline: false,
        },
        {
          name: this.info.field2,
          value:
            'Günlük: % ' +
            d_avg +
            '\nHaftalık: % ' +
            w_avg +
            '\nTüm Zamanlar: % ' +
            a_avg,
          inline: true,
        },
        {
          name: this.info.field3,
          value: `${difference}` + `${this.info.time_field}`,
          inline: false,
        }
      );
    message.channel.send({ embeds: [embed] });
  }
};
