/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */
import { CopyTuple, IMap, ICopy, ISemverMax } from './interfaces';
export declare class Semver {
    filename: string;
    max: ISemverMax;
    full: string;
    ver: string;
    pre: string;
    verArr: number[];
    preArr: number[];
    constructor(filename?: string, max?: number | ISemverMax);
    /**
     * Parse
     * Parses a version string.
     *
     * @param ver the version string to parse.
     */
    private parse(ver);
    /**
     * Get Index
     * Gets the current value in semver by index and the next value.
     *
     * @param idx the index in version array.
     * @param next optional next value.
     */
    private getIndex(idx, next?);
    /**
     * Set Index
     * Sets the value in semver by index.
     *
     * @param idx the index in semver to set.
     * @param next the next value to be set.
     */
    private setIndex(idx, next);
    private setPre(idx, next);
    major(val?: number): void;
    minor(val?: number): void;
    patch(val?: number): void;
    prerelease(prefix: string, val?: number): void;
    bump(): any;
    compare(val1: string, val2: string, operator: string): void;
    save(): void;
}
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
export declare function pkg(filename?: string): any;
export declare function semver(filename?: string, max?: number): Semver;
