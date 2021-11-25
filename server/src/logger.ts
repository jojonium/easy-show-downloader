import {promises as fsPromises, PathLike} from 'fs';
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * Handles logging. The Logger can be configured to log to stdout, a log file,
 * or both.
 */
class Logger {
  /** Whether to write to stdout. */
  public stdout: boolean = true;
  /** An optional file path to write logs to. */
  public outFile: PathLike | undefined = undefined;

  /**
   * Write a string to stdout and the output file.
   * @param {string} s The string to write
   */
  private async write(s: string): Promise<void> {
    s = s.trim();
    if (this.stdout) {
      console.log(s);
    }
    if (this.outFile !== undefined) {
      await fsPromises.appendFile(this.outFile, s + '\n');
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
