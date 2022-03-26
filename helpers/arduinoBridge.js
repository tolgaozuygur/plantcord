const config = require('../config.json');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

if(config.arduino_port != ""){
	const port = new SerialPort({ path: config.arduino_port, baudRate: 9600 })
	const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

	moisture = 0;

	parser.on('data', data =>{
	  //console.log('Arduino:', data);
	  var splitData = data.split("=");
	  if(splitData[0] = "m"){
		  moisture = splitData[1];
	  }
	});
}

module.exports.getMoisture= () => {
  return moisture;
}

