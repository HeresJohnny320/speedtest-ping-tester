# Network Monitoring Tool

This project is a Node.js application designed to monitor network performance through regular speed and ping tests. It logs the results and provides a web interface for users to view the data, including speed test results and uptime/downtime logs.

## Features

- **Speed Testing**: Measures download and upload speeds using `speedtest-net`.
- **Ping Testing**: Checks the availability of specified hosts and logs uptime and downtime events.
- **Data Logging**: Results are stored in JSON format for easy access and analysis.
- **Web Interface**: A simple web application that visualizes speed test results and displays uptime and downtime logs.
- **Dark/Light Mode Toggle**: A user-friendly interface with theme switching capabilities.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- npm (Node package manager, included with Node.js)

### Steps to Install

1. **Clone the repository**:

   ```bash
   git clone https://github.com/HeresJohnny320/speedtest-ping-tester
   cd speedtest-ping-tester
   ```

   2. **Install dependencies**

```bash
npm install
```

3. **Edit config**
  ```json
{
    "port":80,
    "pingTimeout": 10,
    "pingAmount": 7,
    "pingHosts": ["192.168.0.1", "192.168.1.1", "google.com", "yahoo.com","github.com","discord.com","youtube.com"]
}
```
Adjust the values as needed:

    pingTimeout: Timeout for ping requests (in seconds).
    pingAmount: Number of ping requests to send.
    pingHosts: An array of hosts to ping.
    port: Port for the Express server

  4. **Running the Application**
     ```bash
     node index.js
     ```

  5. **Accessing the Web Interface**
     Open your web browser and navigate to:
     ```
     http://localhost
     ```

     DONE
