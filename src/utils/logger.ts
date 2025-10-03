/**
 * Centralized Logging Utility
 * Provides structured logging with levels, context, and production/development modes
 * 
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 * 
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to load properties', { error, context: 'useSimplifiedSearch' });
 * logger.debug('Filter state updated', { filters });
 * ```
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Configuration for the logger
 */
interface LoggerConfig {
  /** Minimum log level to output */
  level: LogLevel;
  /** Whether to include timestamps */
  enableTimestamps: boolean;
  /** Whether to include context in logs */
  enableContext: boolean;
  /** Whether to send errors to external service (future) */
  enableRemoteLogging: boolean;
}

/**
 * Default logger configuration
 * Production: Only errors
 * Development: All logs
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: import.meta.env.PROD ? LogLevel.ERROR : LogLevel.DEBUG,
  enableTimestamps: !import.meta.env.PROD,
  enableContext: true,
  enableRemoteLogging: false,
};

/**
 * Logger class for structured logging
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Update logger configuration
   */
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Log a debug message (lowest priority)
   * @param message - The log message
   * @param context - Additional context data
   */
  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   * @param message - The log message
   * @param context - Additional context data
   */
  public info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   * @param message - The log message
   * @param context - Additional context data
   */
  public warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message (highest priority)
   * @param message - The log message
   * @param error - The error object
   * @param context - Additional context data
   */
  public error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    this.log(LogLevel.ERROR, message, errorContext);
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    // Skip if below minimum level
    if (level < this.config.level) {
      return;
    }

    const timestamp = this.config.enableTimestamps
      ? new Date().toISOString()
      : undefined;

    const logData = {
      level: LogLevel[level],
      message,
      ...(timestamp && { timestamp }),
      ...(this.config.enableContext && context && { context }),
    };

    // Output to console based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug('🔍', message, context || '');
        break;
      case LogLevel.INFO:
        console.info('ℹ️', message, context || '');
        break;
      case LogLevel.WARN:
        console.warn('⚠️', message, context || '');
        break;
      case LogLevel.ERROR:
        console.error('❌', message, context || '');
        break;
    }

    // Send to remote logging service if enabled
    if (this.config.enableRemoteLogging && level >= LogLevel.ERROR) {
      this.sendToRemote(logData);
    }
  }

  /**
   * Send logs to remote service (placeholder for future implementation)
   */
  private sendToRemote(logData: unknown): void {
    // TODO: Implement remote logging (e.g., Sentry, LogRocket)
    // For now, just a placeholder
    if (import.meta.env.DEV) {
      console.debug('Would send to remote:', logData);
    }
  }

  /**
   * Create a child logger with additional context
   * @param context - Context to add to all logs from this logger
   * @returns New logger instance with context
   */
  public createChild(context: Record<string, unknown>): ChildLogger {
    return new ChildLogger(this, context);
  }
}

/**
 * Child logger that includes context in all log calls
 */
class ChildLogger {
  constructor(
    private parent: Logger,
    private context: Record<string, unknown>
  ) {}

  public debug(message: string, additionalContext?: Record<string, unknown>): void {
    this.parent.debug(message, { ...this.context, ...additionalContext });
  }

  public info(message: string, additionalContext?: Record<string, unknown>): void {
    this.parent.info(message, { ...this.context, ...additionalContext });
  }

  public warn(message: string, additionalContext?: Record<string, unknown>): void {
    this.parent.warn(message, { ...this.context, ...additionalContext });
  }

  public error(
    message: string,
    error?: Error | unknown,
    additionalContext?: Record<string, unknown>
  ): void {
    this.parent.error(message, error, { ...this.context, ...additionalContext });
  }
}

/**
 * Extended Logger class with performance measurement
 */
class ExtendedLogger extends Logger {
  /**
   * Performance measurement utility
   * @param name - Name of the operation to measure
   * @returns Function to call when operation completes
   * 
   * @example
   * ```typescript
   * const endTimer = logger.performance('loadProperties');
   * await loadProperties();
   * endTimer(); // Logs: "⏱️ loadProperties completed in 1234ms"
   * ```
   */
  public performance(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.debug(`⏱️ ${name} completed in ${duration}ms`);
    };
  }
}

/**
 * Singleton logger instance
 */
export const logger = new ExtendedLogger();
