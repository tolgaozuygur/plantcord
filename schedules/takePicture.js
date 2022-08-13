const { scheduleJob } = require('node-schedule');
const NodeWebcam = require('node-webcam');
const fs = require("fs");
const compatOs = ["freebsd", 'linux', 'openbsd', 'sunos', 'aix'];

function takePicture(client) {
	var FSWebcam = NodeWebcam.FSWebcam;
	var opts = {
		rotation: client.config.photo_rotation,
		quality: 90,
		width: client.config.photo_width,
		height: client.config.photo_height,
		output: client.config.photo_ftype
	};
	var webcam = new FSWebcam(opts);
	console.log('Trying to take picture...');
	try {
		webcam.capture(client.config.photo_path);
		console.log('Took picture!');
	} catch (err) {
		console.error('Failed to take picture.');
		console.error(err)
	}
}

function takePictureNonLinux(client) {
	var opts = {
		quality: 80,
		width: client.config.photo_width,
		height: client.config.photo_height,
		output: client.config.photo_ftype
	};
	try {
		NodeWebcam.capture(client.config.photo_path, opts)
		console.log('Took a new picture of the plant!');
	} catch (err) {
		console.error('Failed to take picture non-linux');
        console.error(err)
	}
}

module.exports.execute = async (client) => {
	schedule.scheduleJob(client.helpers.secToCron(client.config.take_photo_interval), function () {
		if (compatOs.includes(process.platform)) {
			takePicture(client);
		} else {
			takePictureNonLinux(client);
		}

		const date = new Date();
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		if (date.getHours() != client.config.take_photo_interval_dailyhour) return;

		if (!fs.existsSync(`./photoarchive`)) fs.mkdirSync(`./photoarchive`, { recursive: true });

		var photonumber = (fs.readdirSync('./photoarchive').length + 1).toString();

		fs.copyFile(client.config.photo_path, `./photoarchive/${photonumber}-photo-${month}-${day}-${year}.${client.config.photo_ftype}`, (err) => {
			if (err) throw err;
			console.log('File copied successfully');
		});
	});
}
