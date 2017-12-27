import { CopyTuple, IMap, ICopy, ICpu } from './interfaces';
import { Options, BrowserSyncInstance } from 'browser-sync';
export declare const cwd: string;
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
export declare function copyAll(copies: CopyTuple[] | CopyTuple | IMap<ICopy> | string[]): {
    success: any;
    failed: any;
};
/**
 * Pkg
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
export declare function pkg(val?: any): any;
/**
 * Bump
 * : Bumps the package version.
 *
 * @param type the release type to increment the package by.
 */
export declare function bump(type?: 'major' | 'premajor' | 'minor' | 'preminor' | 'patch' | 'prepatch' | 'prerelease'): {
    name: any;
    version: any;
    previous: any;
    current: any;
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
