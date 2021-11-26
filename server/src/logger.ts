import fs from 'fs';
import {config} from './config';
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * Handles logging. The Logger can be configured to log to stdout, a log file,
 * or both.
 */
class Logger {
  /**
   * Write a string to stdout and the output file.
   * @param {string} s The string to write
   */
  private async write(s: string): Promise<void> {
    s = s.trim();
    if (config.LOG_STDOUT) {
      console.log(s);
    }
    if (config.LOG_FILE !== undefined) {
      await fs.promises.appendFile(config.LOG_FILE, s + '\n');
    }
  }

  /**
   * Write some text to the log.
   * @param {string?} text Text to write to the log.
   * @param {string?} level Options: 'DEBUG', 'INFO', 'WARN', 'ERROR', or
   * 'FATAL'. Default is 'INFO'.
   * @return {string} The text that was written.
   */
  public async log(
      text: string = '',
      level: LogLevel = 'INFO',
  ): Promise<string> {
    const s = `${new Date().toISOString()} [${level}] ${text}`;
    await this.write(s);
    return s;
  }
}

/** The single instance of a logger. */
export const logger = new Logger();
