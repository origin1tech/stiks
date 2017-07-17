import { CopyTuple, IMap, ICopy, ITSNodeOptions } from './interfaces';
/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
export declare function clean(globs: string | string[]): void;
/**
 * Copy
 * Copies source to target.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
export declare function copy(src: string, dest: string): void;
/**
 * CopyAll
 * Takes collection and copies each source/destination pair.
 *
 * @param copies collection of source and destination targets.
 */
export declare function copyAll(copies: CopyTuple | IMap<ICopy> | string[]): void;
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
export declare function bump(): void;
/**
 * TS Register
 * Calls ts-node's register option.
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 *
 * @param opts ts-node options.
 */
export declare function tsRegister(project?: string | ITSNodeOptions, opts?: ITSNodeOptions): void;
