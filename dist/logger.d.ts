/// <reference types="node" />
import { ILoggerOptions } from './interfaces';
export declare class Logger {
    stream: NodeJS.WritableStream;
    options: ILoggerOptions;
    constructor(options?: ILoggerOptions);
    /**
     * Get Index
     * Gets the index of a value in an array.
     *
     * @param key the key to get the index for.
     * @param arr the array to be inspected.
     */
    private getIndex(key, arr);
    /**
     * Colorize
     * Applies ansi styles to value.
     *
     * @param val the value to be colorized.
     * @param styles the styles to be applied.
     */
    private colorize(val, styles);
    /**
     * Colorize If
     * If colors are enabled apply ansi styles to value.
     *
     * @param val the value to be colorized.
     * @param styles the styles to be applied.
     */
    private colorizeIf(val, styles);
    /**
     * Parse Stack
     * Simple stack parser to limit and stylize stacktraces.
     *
     * @param stack the stacktrace to be parsed.
     * @param prune number of stack frames to prune.
     * @param depth the depth to trace.
     */
    private parseStack(stack, prune?, depth?);
    /**
     * Get Timestamp
     * Gets a timestamp by format.
     *
     * @param format the format to return.
     */
    private getTimestamp(format?);
    /**
     * Uncaught Exception
     * Handler for uncaught excrptions.
     *
     * @param err the error caught by process uncaughtException.
     */
    private uncaughtException(err);
    /**
     * Toggle Exception Handler
     * Toggles uncaughtException listener.
     *
     * @param capture whether to capture uncaught exceptions or not.
     */
    private toggleExceptionHandler(capture?);
    /**
     * Logger
     * Private common logger method.
     *
     * @param type the type of log message to log.
     * @param args the arguments to be logged.
     */
    private logger(type, ...args);
    /**
     * Get
     * Gets a current option value.
     *
     * @param key the option key to get.
     */
    get<T>(key: string): T;
    /**
     * Set
     * Sets options for Logger.
     *
     * @param key the key or options object to be set.
     * @param value the value for the key.
     */
    set(key: string | ILoggerOptions, value: any): void;
    error(...args: any[]): Logger;
    warn(...args: any[]): Logger;
    info(...args: any[]): Logger;
    debug(...args: any[]): Logger;
    write(...args: any[]): Logger;
    exit(code?: number): void;
}
declare function createInstance(options?: ILoggerOptions): Logger;
export { createInstance as get };
