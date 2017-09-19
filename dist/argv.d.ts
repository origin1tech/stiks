declare let _args: string[];
declare let _baseArgs: string[];
declare let _optionArgs: string[];
/**
 * Is Flag
 * Checks if value is type of flag param.
 *
 * @param flag the value to inspect to detect if is flag.
 */
export declare function isFlag(flag: string): false | "value" | "boolean";
/**
 * Parse Element
 * Inspects value parses value as command or flag.
 *
 * @param val the value to inspect/convert to flag.
 * @param idx the current index position of the value.
 * @param args the array of argv params.
 */
export declare function parseElement(val: string, idx: number, args: any[]): {};
export declare function parse(args?: any[]): {
    flags: {
        [key: string]: any;
    };
    cmds: any[];
    cmd: string;
};
/**
 * Find
 * Iterates expected or valid values stopping if matching value is found in provided args.
 *
 * @param valid array of expected valid values.
 * @param args array of params to inspect.
 */
export declare function find(valid: string[], args?: string[]): any;
export { _args as args, _baseArgs as normalized, _optionArgs as options };
