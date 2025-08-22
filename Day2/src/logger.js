const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const EventEmitter = require('events');

class FileLogger extends EventEmitter {
  constructor(logDirectory = 'logs', logFileName = 'requests.log') {
    super();
    this.logDirectory = logDirectory;
    this.logFilePath = path.join(logDirectory, logFileName);
    this.init();
  }

  init() {
    // Create log directory if it doesn't exist - using async fs
    fs.access(this.logDirectory, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(this.logDirectory, { recursive: true }, (err) => {
          if (err) {
            this.emit('error', `Failed to create directory: ${err.message}`);
            return;
          }
          this.createStreams();
        });
      } else {
        this.createStreams();
      }
    });
  }

  createStreams() {
    // Create write stream with error handling
    this.writeStream = fs.createWriteStream(this.logFilePath, {
      flags: 'a', // append mode
      encoding: 'utf8',
      autoClose: true
    });

    // Handle stream errors
    this.writeStream.on('error', (err) => {
      this.emit('error', `Write stream error: ${err.message}`);
    });

    this.writeStream.on('open', () => {
      this.emit('ready', 'Logger ready');
    });

    // Create transform stream for formatting using buffers
    this.formatStream = new Transform({
      transform(chunk, encoding, callback) {
        try {
          // Convert buffer to string if needed
          const data = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
          const formattedData = data + '\n';
          callback(null, Buffer.from(formattedData));
        } catch (error) {
          callback(error);
        }
      }
    });

    // Pipe format stream to write stream
    this.formatStream.pipe(this.writeStream);
  }

  logRequest(req, res, responseTime) {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ip: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || 'unknown',
      responseTime: `${responseTime}ms`
    };

    this.writeToStream(JSON.stringify(logData));
  }

  getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown';
  }

  writeToStream(data) {
    if (this.formatStream && !this.formatStream.destroyed) {
      this.formatStream.write(data);
    } else {
      this.emit('warning', 'Stream not available, buffering data');
      // Buffer the data and try to write when stream is ready
      setTimeout(() => this.writeToStream(data), 100);
    }
  }

  // Async file operations for log reading
  readLogs(callback) {
    fs.readFile(this.logFilePath, 'utf8', (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, data);
    });
  }

  // Get log file info using async fs
  getLogInfo(callback) {
    fs.stat(this.logFilePath, (err, stats) => {
      if (err) {
        callback(err, null);
        return;
      }

      this.readLogs((err, data) => {
        if (err) {
          callback(err, null);
          return;
        }

        const lines = data.trim().split('\n');
        const logCount = lines.filter(line => line.trim()).length;

        callback(null, {
          fileSize: stats.size,
          totalEntries: logCount,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      });
    });
  }

  // Graceful shutdown
  shutdown(callback) {
    if (this.formatStream) {
      this.formatStream.end(() => {
        if (this.writeStream) {
          this.writeStream.end(() => {
            this.emit('shutdown', 'Logger shut down gracefully');
            if (callback) callback();
          });
        } else {
          if (callback) callback();
        }
      });
    } else {
      if (callback) callback();
    }
  }
}

// Create and export singleton instance
const logger = new FileLogger();

// Event handling for the logger
logger.on('error', (message) => {
  console.error('Logger Error:', message);
});

logger.on('warning', (message) => {
  console.warn('Logger Warning:', message);
});

logger.on('ready', (message) => {
  console.log('Logger:', message);
});

logger.on('shutdown', (message) => {
  console.log('Logger:', message);
});

module.exports = logger;