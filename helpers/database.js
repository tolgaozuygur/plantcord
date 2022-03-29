const Database = require('../Schemas/Database');

module.exports.getDay = async (client) => {
  let data = await Database.findOne({ Plant: client.config.plant_name })
    .exec()
    .then((doc) => {
      return doc.Day;
    });
  return data;
};

module.exports.checkDay = async (client) => {
  let data = await Database.findOne({ Plant: client.config.plant_name }).exec();
  if (!data)
    return new Database({
      Plant: client.config.plant_name,
      Day: 1,
      NextDay: new Date().setHours(24, 0, 0, 0),
      Hour: 1,
    }).save();
  if (data.NextDay < Date.now()) {
    data.NextDay = new Date().setHours(24, 0, 0, 0);
    data.Day += 1;
  }
  data.save();
};

module.exports.getHour = async (client) => {
  let data = await Database.findOne({ Plant: client.config.plant_name });
  data.Hour += 1;
  if (data.Hour > 24) {
    let datas = Object.values(data.Moisture).reduce((x, y) => x + y, 0);
    let moisturedays = Object.keys(data.Moisture);
    let day = await client.helpers.database.getDay(client);
    let moisture = 0;
    moisturedays.forEach((_day) => {
      if (day == _day) {
        moisture = datas / 24;
      }
    });
    data.Hour = 0;
    Database.updateOne(
      { Plant: client.config.plant_name },
      {
        $set: {
          [`Moisture.${await client.helpers.database.getDay(client)}`]:
            moisture,
        },
      }
    ).exec();
  }
  data.save();
  return data.Hour;
};
