const availableOs=["freebsd",'linux','openbsd','sunos','aix'];
const NodeWebcam = require('node-webcam');
const fs = require('fs');
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
    webcam.capture(client.config.photo_path, function () {} );
    console.log('Took a new picture of the plant!');
  }

function takePictureNonLinux(client) {
    var opts = {
        quality:80,
        width:client.config.photo_width,
        height:client.config.photo_height,
        output:client.config.photo_ftype
    };
    NodeWebcam.capture(client.config.photo_path, opts, function () {} );
    console.log('Took a new picture of the plant!');
}

function saveThatPic(){
    var current = new Date();
    if(fs.existsSync(`./collage/${current.getFullYear()}/${current.getMonth()}/${current.getDate()}.png`)){
        console.log('DEBUG: Collage already exists, skipping.');
    }else{
        console.log('DEBUG: Collage does not exist, creating.');
        fs.copyFile(client.config.photo_path, `./collage/${current.getFullYear()}/${current.getMonth()}/${current.getDate()}.png`, (err) => {
            if (err) throw err;
            console.log('DEBUG: Collage created.');
        });
    }
}

module.exports.execute = (client) => {
    schedule.scheduleJob(client.helpers.secToCron(client.config.take_photo_interval), function(){
        if(availableOs.includes(process.platform)){
            takePicture(client);
        }else{
            takePictureNonLinux(client);
        }
        saveThatPic();
    });
}
