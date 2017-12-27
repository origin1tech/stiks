/**
 * Cast To Type
 * : Loosely tries to cast numbers and booleans.
 *
 * @param val the value to be cast.
 */
export declare function castToType(val: any): any;
/**
 * Flags To Array
 * : Convert flag object to array.
 *
 * @param flags object containing flags.
 */
export declare function flagsToArray(flags: any): any[];
/**
 * Split Args
 * : Splits string of command arguments honoring quotes.
 *
 * @param str the string representing arguments.
 */
export declare function splitArgs(str: string | any[]): any[];
/**
 * Normalize
 * : Spreads multi flag arguments and breaks arguments usign = sign.
 *
 * @example
 * -am: returns -a, -m.
 * --flag=value: returns --flag, value.
 *
 * @param args arguments to be normalized.
 */
export declare function normalizeArgs(args: any, exclude?: any): any;
/**
 * Filter Args
 * : Filters an array of arguments by exclusion list.
 *
 * @param args the arguments to be filtered.
 * @param exclude the arguments to be excluded.
 */
export declare function filterArgs(args: any, exclude: any): any;
/**
 * Merge Args
 * : Merges two sets of command arguments.
 *
 * @param def array of default args.
 * @param args array of new args.
 */
export declare function mergeArgs(def: any, args: any, exclude?: any): any;
/**
 * Parse
 * : Parses command arguments.
 *
 * @param args the arguments to be parsed if null uses process.argv.slice(2)
 * @param exclude any flags or commands that should be excluded.
 */
export declare function parse(args?: any, exclude?: any): {
    command: any;
    commands: any[];
    cmd: any;
    cmds: any[];
    flags: {};
    source: string[];
    normalized: any;
};
