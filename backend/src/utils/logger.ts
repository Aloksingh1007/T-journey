import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
}

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(entry: LogEntry) {
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(entry) + '\n';
    
    // Write to file (async, non-blocking)
    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const colorMap = {
        info: '\x1b[36m',    // Cyan
        warn: '\x1b[33m',    // Yellow
        error: '\x1b[31m',   // Red
        debug: '\x1b[35m'    // Magenta
      };
      
      const resetColor = '\x1b[0m';
      const color = colorMap[entry.level] || '';
      
      console.log(`${color}[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${resetColor}`);
      
      if (entry.meta) {
        console.log(color, entry.meta, resetColor);
      }
    }
  }

  info(message: string, meta?: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      meta
    });
  }

  warn(message: string, meta?: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      meta
    });
  }

  error(message: string, meta?: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      meta
    });
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        meta
      });
    }
  }

  // Clean up old log files (keep last 30 days)
  async cleanupOldLogs() {
    try {
      const files = await fs.promises.readdir(this.logDir);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      for (const file of files) {
        if (file.endsWith('.log')) {
          const fileDate = new Date(file.replace('.log', ''));
          if (fileDate < thirtyDaysAgo) {
            await fs.promises.unlink(path.join(this.logDir, file));
            this.info(`Cleaned up old log file: ${file}`);
          }
        }
      }
    } catch (error) {
      this.error('Failed to cleanup old logs', error);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Cleanup old logs on startup
logger.cleanupOldLogs();

export default logger;