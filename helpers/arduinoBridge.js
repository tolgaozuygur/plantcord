const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
var port;
var fan_state = 0;

if(config.arduino_port != ""){
	port = new SerialPort({ path: config.arduino_port, baudRate: 9600 })
	port.flush(function(err,results){});
	const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

	moisture = 0;

	parser.on('data', data =>{
	  //console.log('Arduino:', data);
	  var splitData = data.split("=");
	  if(splitData[0] == "m"){
		  moisture = splitData[1];
	  }
	});
}

module.exports.getMoisture= () => {
  return moisture;
}

module.exports.getFanStateText= () => {
	if(fan_state == 0){
		return localization.commands.info.fan_off;
	}else{
		return localization.commands.info.fan_on;
	}
}


module.exports.waterThePlant= () => {
	if(port != null){
		port.write('wtr\n', (err) => {
		if (err) {
			return console.log('Error on writing to arduino port: ', err.message);
		}
			//console.log('Water plant message sent');
		});
	}
}

module.exports.turnOnTheFan= () => {
	if(port != null){
		port.write('fanon\n', (err) => {
		if (err) {
			return console.log('Error on writing to arduino port: ', err.message);
		}
			//console.log('Turn on fan message sent');
			fan_state = 1;
		});
	}
}

module.exports.turnOffTheFan= () => {
	if(port != null){
		port.write('fanoff\n', (err) => {
		if (err) {
			return console.log('Error on writing to arduino port: ', err.message);
		}
			//console.log('Turn off fan message sent');
			fan_state = 0;
		});
	}
}


