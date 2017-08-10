import { CopyTuple, IMap, ICopy, IStringBuilderMethods, ICpu } from './interfaces';
import { Options, BrowserSyncInstance } from 'browser-sync';
export declare const cwd: string;
/**
 * Seed
 * Seeds known templates/examples.
 */
export declare const seed: {
    build: any;
};
/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
export declare function clean(globs: string | string[]): void;
/**
 * Copy
 * Copies source to target. Does NOT support globs.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
export declare function copy(src: string, dest: string): boolean;
/**
 * Copy All
 * Takes collection and copies to destination.
 *
 * @param copies collection of source and destination targets.
 */
export declare function copyAll(copies: CopyTuple[] | CopyTuple | IMap<ICopy> | string[]): void;
/**
 * Pkg
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
export declare function pkg(val?: any): any;
/**
 * Bump
 * Bumps project to next version.
 *
 * @param filename optional filename defaults to package.json in cwd.
 */
export declare function bump(): {
    name: any;
    version: any;
    original: any;
};
/**
 * Serve
 * Hook to Browser Sync accepts name and options returning a Browser Sync Server Instance.
 * @see https://www.browsersync.io/docs/api
 *
 * @param name the name of the server or Browser Sync options.
 * @param options the Browser Sync Options.
 */
export declare function serve(name?: string | Options, options?: Options | boolean, init?: boolean): BrowserSyncInstance;
/**
 * Layout
 * Creates a CLI layout much like creating divs in the terminal.
 * Supports strings with \t \s \n or IUIOptions object.
 * @see https://www.npmjs.com/package/cliui
 *
 * @param width the width of the layout.
 * @param wrap if the layout should wrap.
 */
export declare function layout(width?: number, wrap?: boolean): {
    ui: any;
    div: <T>(...elements: T[]) => void;
    span: <T>(...elements: T[]) => void;
    render: <T>(...elements: T[]) => void;
};
/**
 * String Builder
 * Builds string then joins by char with optional colorization.
 *
 * @param str the base value to build from if any.
 */
export declare function stringBuilder(str?: any): IStringBuilderMethods;
/**
 * String Format
 * Very simple string formatter by index.
 * Supports using %s or %n chars.
 *
 * @private
 * @param str the string to be formatted.
 * @param args arguments used for formatting.
 */
export declare function stringFormat(str: any, ...args: any[]): any;
/**
 * Platform
 * Gets information and paths for the current platform.
 */
export declare function platform(): {
    platform: any;
    arch: string;
    release: string;
    hostname: string;
    homedir: string;
    cpu: ICpu;
};
