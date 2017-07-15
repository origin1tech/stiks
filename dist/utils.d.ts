/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */
import { CopyTuple, IMap, ICopy } from './interfaces';
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
 * Loads the package.json file for project.
 */
export declare function pkg(): any;
export declare function semver(max?: number): any;
