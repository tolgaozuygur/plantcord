
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'png', width: 1920, height: 1080, backgroundColour: 'white'  });
const schedule = require('node-schedule');
const fs = require("fs");
let  measuredData={
  days : ['22.03','23.03','24.03','25.03','26.03','27.03','28.03','29.03','30.03','1.04','2.04','3.04','4.04','5.04','6.04','7.04','8.04','9.04','10.04','11.04','12.04','13.04','14.04','15.04','16.04','17.04','18.04','19.04','20.04','21.04','22.04'],
  measurements : [76,55,64,58,59,66,48,49,51,45,80,76,44,55,62,45,53,47,56,70,43,55,68,69,76,56,43,43,71,57],
  maxValue : [],
  minValue : [],
}
module.exports.execute = (client) => { 

    measuredData.days.forEach(m=>{
      measuredData.maxValue.push(client.config.moisture_max)
      measuredData.minValue.push(client.config.moisture_min)
    })
    schedule.scheduleJob(client.helpers.secToCron(client.config.graph_export_interval), function(){
    (async () => {
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
        //min value line
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
            text: 'Chart.js Line Chart updated 1'
          }
        }
      },
    }
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    const fileContents = new Buffer.from(image)
    fs.writeFile(client.config.graph_path, fileContents, (err) => {
      if (err) return console.error(err)
      console.log('graph file saved to ', client.config.graph_path)
    })

    })();
    })
}
