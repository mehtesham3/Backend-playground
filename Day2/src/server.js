const http = require('http');
const url = require('url');
const os = require('os');
const logger = require('./logger');

class LoggingServer {
  constructor(port = 3000) {
    this.port = port;
    this.server = null;
    this.startTime = new Date();
  }

  handleRequest(req, res) {
    const startTime = process.hrtime();

    // Parse URL
    const parsedUrl = url.parse(req.url, true);

    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Add finish event listener to calculate response time
    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      // Log the request
      logger.logRequest(req, res, responseTime);
    });

    // Route handling
    if (parsedUrl.pathname === '/') {
      this.serveHome(req, res);
    } else if (parsedUrl.pathname === '/api/status') {
      this.serveStatus(req, res);
    } else if (parsedUrl.pathname === '/api/logs') {
      this.serveLogs(req, res);
    } else if (parsedUrl.pathname === '/api/system') {
      this.serveSystemInfo(req, res);
    } else {
      this.serveNotFound(req, res);
    }
  }

  serveHome(req, res) {
    const response = {
      message: "File Logger API",
      endpoints: {
        home: "/",
        status: "/api/status",
        logs: "/api/logs",
        system: "/api/system"
      },
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  }

  serveStatus(req, res) {
    logger.getLogInfo((err, info) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to get log info' }));
        return;
      }

      const response = {
        status: 'Server is running',
        uptime: process.uptime(),
        serverStartTime: this.startTime.toISOString(),
        logInfo: info
      };

      res.writeHead(200);
      res.end(JSON.stringify(response, null, 2));
    });
  }

  serveLogs(req, res) {
    logger.readLogs((err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to read logs' }));
        return;
      }

      try {
        const logs = data.trim().split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
          .reverse(); // Show latest first

        res.writeHead(200);
        res.end(JSON.stringify({
          total: logs.length,
          logs: logs.slice(0, 50) // Limit to 50 most recent
        }, null, 2));
      } catch (parseError) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to parse logs' }));
      }
    });
  }

  serveSystemInfo(req, res) {
    const systemInfo = {
      platform: os.platform(),
      architecture: os.arch(),
      cpus: os.cpus().length,
      totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      uptime: (os.uptime() / 3600).toFixed(2) + ' hours',
      hostname: os.hostname()
    };

    res.writeHead(200);
    res.end(JSON.stringify(systemInfo, null, 2));
  }

  serveNotFound(req, res) {
    const response = {
      error: 'Not Found',
      message: `Endpoint ${req.url} not found`,
      timestamp: new Date().toISOString()
    };

    res.writeHead(404);
    res.end(JSON.stringify(response, null, 2));
  }

  start() {
    this.server = http.createServer(this.handleRequest.bind(this));

    this.server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
      console.log('OS Platform:', os.platform());
      console.log('Server started at:', this.startTime.toLocaleString());
    });

    // Handle server errors
    this.server.on('error', (err) => {
      console.error('Server error:', err);
    });
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Server stopped');
        logger.shutdown(() => {
          process.exit(0);
        });
      });
    }
  }
}

// Create and start server
const server = new LoggingServer(3000);
server.start();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  server.stop();
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  server.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.stop();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.stop();
});