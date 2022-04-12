
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'png', width: 1920, height: 1080, backgroundColour: 'white'  });
const fs = require("fs");
const csv = require('csvtojson')
let daysArray = [];
let measurementsArray = [];
module.exports.execute = (client) => { 

    schedule.scheduleJob(client.helpers.secToCron(client.config.graph_export_interval), function() {
    (async () => {

      const rows = await csv().fromFile("./moisture_data.csv");
      rows.forEach(r=>{
        daysArray.push(convertTime(r.time,":"));
        measurementsArray.push(r.moisture);
      })
      let  measuredData={
        days : daysArray,
        measurements : measurementsArray,
        maxValue : [],
        minValue : [],
      }
    
    measuredData.days.forEach(m=>{
      measuredData.maxValue.push(client.config.moisture_max)
      measuredData.minValue.push(client.config.moisture_min)
    })
      
    const configuration = {
      backgroundColor : 'rgba(255, 99, 132, 0)',
      type: 'line',
      data: {
        labels: measuredData.days,
        datasets: [
          //max value line
        {
          borderDash: [3],
          data: measuredData.maxValue,
          borderColor: [
            'rgba(80, 80, 80, 0.8)',
          ],
          borderWidth: 1,
          pointRadius: 0,
        },
        // min value line
        {
          borderDash: [3],
          data: measuredData.minValue,
          borderColor: [
            'rgba(80, 80, 80, 0.8)',
          ],
          borderWidth: 1,
          pointRadius: 0,
        },
        {
          data: measuredData.measurements,
          backgroundColor: [
            'rgba(107, 107, 203, 0.5)',
          ],
          borderColor: [
            'rgba(107, 107, 203, 1)',
          ],
          tension : 0.2,
          borderWidth: 2,
          fill: true,
          pointRadius: 0.3,
        },
      ]
      },
      options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
          legend: { display: false, },
          title: {
            display: true,
            text: 'Chart'
          }
        }
      },
    }
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const fileContents = new Buffer.from(image)
    fs.writeFile(client.config.graph_path, fileContents, (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('graph file saved to ', client.config.graph_path)
    })

    })();
    })
}

var convertTime = function(date, separator) {
  var date = new Date(parseInt(date));
  return date.getHours()+
  separator+(date.getMinutes());
}