type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs: number = 1000

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data
    }

    this.logs.push(logEntry)

    // Keep only the latest maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output with colors
    const styles: Record<LogLevel, string> = {
      info: 'color: #3b82f6',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
      debug: 'color: #8b5cf6'
    }

    console.log(
      `%c[${level.toUpperCase()}] ${this.formatTimestamp()} - ${message}`,
      styles[level],
      data || ''
    )
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data)
  }

  warn(message: string, data?: any) {
    this.addLog('warn', message, data)
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data)
  }

  debug(message: string, data?: any) {
    this.addLog('debug', message, data)
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Clear all logs
  clearLogs() {
    this.logs = []
    console.clear()
  }
  
  // Download logs as file
  downloadLogs(filename: string = 'app-logs.json') {
    const dataStr = this.exportLogs()
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

}

// Create singleton instance
const logger = new Logger()

export default logger
