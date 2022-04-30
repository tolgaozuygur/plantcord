const availableOs=["freebsd",'linux','openbsd','sunos','aix'];
const { scheduleJob, scheduledJobs } = require('node-schedule');
const NodeWebcam = require('node-webcam');
const fs = require("fs")
function takePicture(client) {
    var FSWebcam = NodeWebcam.FSWebcam;
    var opts = {
      rotation:client.config.photo_rotation,
      quality:90,
      width:client.config.photo_width,
      height:client.config.photo_height,
      output:client.config.photo_ftype
    };
    var webcam = new FSWebcam( opts );
    webcam.capture(client.config.photo_path, function ( err, data ) {} );
    console.log('Took a new picture of the plant!');
  }

function takePictureNonLinux(client) {
    var opts = {
        quality:80,
        width:client.config.photo_width,
        height:client.config.photo_height,
        output:client.config.photo_ftype
    };
    NodeWebcam.capture(client.config.photo_path, opts, function ( err, data ) {} );
    console.log('Took a new picture of the plant!');
}

module.exports.execute = async(client) => {
    schedule.scheduleJob(client.helpers.secToCron(client.config.take_photo_interval), function(){
        if(availableOs.includes(process.platform)){
            takePicture(client);
        }else{
            takePictureNonLinux(client);
        }

        const date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        if(!date.getHours == client.config.take_photo_interval_dailyhour) return

        if (!fs.existsSync(`../photos/${month}`)) {
          fs.mkdir(`../photos/${month}`, {recursive: true}, err => {console.log(err)})
        }
        await fs.copyFile(client.config.photo_path, `../photos/${month}/${day}.png`, (err) => {
              if (err) throw err;
              console.log('File was copied to destination');
            });
    });
}
