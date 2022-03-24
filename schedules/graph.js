
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'png', width: 800, height: 600, backgroundColour: 'black'  });
const fs = require("fs");
module.exports.execute = (client) => { 
    schedule.scheduleJob('*/1 * * * * *', function(){
    (async () => {
    const configuration = {
      type: 'line',
      data: {
        labels: ['22.03','23.03','24.03','25.03','26.03','27.03','28.03','29.03','30.03','1.04','2.04','3.04','4.04','5.04','6.04','7.04','8.04','9.04','10.04','11.04','12.04','13.04','14.04','15.04','16.04','17.04','18.04','19.04','20.04','21.04','22.04',],
        datasets: [{
          data: [35,64,72,48,57,20,17,38,69,53,12,100,10,48,38,13,95,99,33,81,45,83,93,99,81,65,60,38,35,74,16],
          backgroundColor: [
            'rgba(255, 99, 132, 0)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false, },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
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