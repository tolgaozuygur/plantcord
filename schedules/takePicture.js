const availableOs=["freebsd",'linux','openbsd','sunos','aix'];
const { scheduleJob, scheduledJobs } = require('node-schedule');
const NodeWebcam = require('node-webcam');
const fs = require("fs")
function takePicture(path) {
    var FSWebcam = NodeWebcam.FSWebcam;
    var opts = {
      rotation:client.config.photo_rotation,
      quality:90,
      width:client.config.photo_width,
      height:client.config.photo_height,
      output:client.config.photo_ftype
    };
    var webcam = new FSWebcam( opts );
    webcam.capture(path, function ( err, data ) {} );
    console.log('Took a new picture of the plant!');
  }

function takePictureNonLinux(path) {
    var opts = {
        quality:80,
        width:client.config.photo_width,
        height:client.config.photo_height,
        output:client.config.photo_ftype
    };
    NodeWebcam.capture(path, opts, function ( err, data ) {} );
    console.log('Took a new picture of the plant!');
}

module.exports.execute = (client) => {
    schedule.scheduleJob(client.helpers.secToCron(client.config.take_photo_interval), function(){
        if(availableOs.includes(process.platform)){
            takePicture(client.config.photo_path);
        }else{
            takePictureNonLinux(client.config.photo_path);
        }
    });
    schedule.scheduleJob(client.helpers.secToCron(client.config.take_photo_interval_daily), function () {
      const date = new Date()
      let day = date.getDate()
      let month = date.getMonth() + 1
      console.log(day, month)

      try {
        if (!fs.existsSync(`../photos/${month}`)) {
          fs.mkdir(`../photos/${month}`, {recursive: true}, err => {console.log(err)})

          if(availableOs.includes(process.platform)){
            takePicture(`../photos/${month}/${day}`);
          }else{
            takePictureNonLinux(`../photos/${month}/${day}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })
}
