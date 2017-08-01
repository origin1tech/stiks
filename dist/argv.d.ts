declare let origArgs: any;
export declare function isFlag(flag: string): false | "value" | "boolean";
export declare function getFlag(flag: string, idx: number, args: any[]): {};
export declare function parse(args?: any[]): {
    flags: {
        [key: string]: any;
    };
    cmds: any[];
    cmd: string;
};
export declare function findCommand(valid: string[], args?: string[]): any;
export { origArgs as args };
