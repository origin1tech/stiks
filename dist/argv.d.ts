declare let _args: string[];
declare let _baseArgs: string[];
declare let _optionArgs: string[];
export declare function isFlag(flag: string): false | "value" | "boolean";
export declare function getFlag(flag: string, idx: number, args: any[]): {};
export declare function parse(args?: any[]): {
    flags: {
        [key: string]: any;
    };
    cmds: any[];
    cmd: string;
};
export declare function find(valid: string[], args?: string[]): any;
export { _args as args, _baseArgs as normalized, _optionArgs as options };
