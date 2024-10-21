 require('./console.js')
 const readline = require('readline');
const fs = require('fs');
const path = require('path');
const speedTest = require('speedtest-net');
const ping = require('ping');
const express = require('express');
const config = require('./config.json')

const pingTimeout = config.pingTimeout;
const pingAmount = config.pingAmount;
const pingHosts = config.pingHosts;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




const resultsFilePath = path.join(__dirname, 'results.json');
const uptimeFilePath = path.join(__dirname, 'uptime.json');
const downtimeFilePath = path.join(__dirname, 'downtime.json');

// Function to perform speed test
const performSpeedTest = async () => {
  try {
      const result = await speedTest({ maxTime: 5000, acceptLicense: true });
      // console.log('Raw Speed Test Result:', result); // Log the entire result
      const speedResults = {
          download: (result.download.bytes / (1024 * 1024)).toFixed(2),
          upload: (result.upload.bytes / (1024 * 1024)).toFixed(2),
          location: result.server.location,
          id:result.server.id,
          name:result.server.name,
          country:result.server.country,
          host:result.server.host,
          port:result.server.port,
          ip:result.server.ip
      };
      // console.log('Speed Test Results:', speedResults);
      return [speedResults,result];
  } catch (error) {
      console.error('Speed Test Error:', error);
      return [{ 
        download: "N/A",
        upload: "N/A",
        location: "N/A",
        id:"N/A",
        name:"N/A",
        country:"N/A",
        host:"N/A",
        port:"N/A",
        ip:"N/A"
      
      
      }, { error:error}]
  }
};
// Function to perform ping tests
const performPingTests = async () => {
  const pingResults = {};
  const uptimeLog = [];
  const downtimeLog = [];

  for (const host of pingHosts) {
      pingResults[host] = { alive: null, responseTimes: [] }; // Initialize with alive status
      let wasDown = false;

      for (let i = 0; i < pingAmount; i++) {
          try {
              const res = await ping.promise.probe(host, { timeout: pingTimeout });
              pingResults[host].responseTimes.push(res.time || 'N/A');
              pingResults[host].alive = res.alive; // Log alive status

              if (!res.alive) {
                  // If host is down, log downtime
                  if (!wasDown) {
                      wasDown = true;
                      downtimeLog.push({ host, timestamp: new Date().toISOString(), status: 'down' });
                  }
              } else {
                  // If host is back up, log uptime
                  if (wasDown) {
                      wasDown = false;
                      uptimeLog.push({ host, timestamp: new Date().toISOString(), status: 'up' });
                  }
              }
            
          } catch (error) {
              console.error(`Ping Error for ${host}:`, error);
              wasDown = true;
              downtimeLog.push({ host, timestamp: new Date().toISOString(), status: 'down' });
              pingResults[host].responseTimes.push('Error');
              pingResults[host].alive = false; // Set alive status to false on error
          }
      }
  }

  // Write downtime logs to file
  if (downtimeLog.length > 0) {
      fs.readFile(downtimeFilePath, 'utf8', (err, jsonData) => {
          const json = err ? [] : JSON.parse(jsonData);
          json.push(...downtimeLog);
          fs.writeFile(downtimeFilePath, JSON.stringify(json, null, 2), (err) => {
              if (err) console.error('Error writing downtime file:', err);
              else console.log('Downtime logged.');
          });
      });
  }

  // Write uptime logs to file
  if (uptimeLog.length > 0) {
      fs.readFile(uptimeFilePath, 'utf8', (err, jsonData) => {
          const json = err ? [] : JSON.parse(jsonData);
          json.push(...uptimeLog);
          fs.writeFile(uptimeFilePath, JSON.stringify(json, null, 2), (err) => {
              if (err) console.error('Error writing uptime file:', err);
              else console.log('Uptime logged.');
          });
      });
  }

  return pingResults;
};
// Function to run tests and log results
const runTests = async () => {
    console.log('Starting tests...');
    const speedResults = await performSpeedTest();
    var speedResults2 = speedResults[0];
    const pingResults = await performPingTests();
    
    if (speedResults2) {
        const timestamp = new Date().toISOString();
        const data = { timestamp, speedResults2, pingResults };
        full_log_data(speedResults[1],pingResults)
        // Append results to JSON file
        fs.readFile(resultsFilePath, 'utf8', (err, jsonData) => {
            const json = err ? [] : JSON.parse(jsonData);
            json.push(data);
            fs.writeFile(resultsFilePath, JSON.stringify(json, null, 2), (err) => {
                if (err) console.error('Error writing to file:', err);
                else console.log('Results logged.');
            });
        });
    }
};



function full_log_data(speedResults,pingResults) {
  console.info("-------------SPEED TEST-----------:")
  console.info("SPEEDTEST:"+JSON.stringify(speedResults))
  console.info("-------------PING TEST-----------:")
  console.info("PINGTEST:"+JSON.stringify(pingResults)) 
   
}

rl.setPrompt('> '); // Set the prompt symbol
rl.prompt(); // Display the prompt

rl.on('line', (input) => {
    // Handle input here
    switch (input.trim()) {
        case 'run':
            console.log('running yo shit');
            runTests()
            break;
        case 'exit':
            console.log('Exiting...');
            rl.close();
            return;
        default:
            console.log(`You typed: ${input}`);
    }
    rl.prompt(); // Show prompt again
});

rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
});


// Schedule the tests to run every hour
setInterval(runTests, 60 * 60 * 1000); // 1 hour
runTests(); // Run immediately on startup

// Create the Express server
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Endpoint to get results
app.get('/results', (req, res) => {
    fs.readFile(resultsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading results.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to get downtime logs
app.get('/downtime', (req, res) => {
    fs.readFile(downtimeFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading downtime logs.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to get uptime logs
app.get('/uptime', (req, res) => {
    fs.readFile(uptimeFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading uptime logs.');
        }
        res.json(JSON.parse(data));
    });
});

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
