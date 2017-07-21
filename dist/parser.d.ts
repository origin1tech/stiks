declare function isFlag(flag: string): false | "value" | "boolean";
declare function getFlag(flag: string, idx: number, args: any[]): any;
declare function parse(args?: any[]): {
    flags: {
        [key: string]: any;
    };
    cmds: any[];
};
export { isFlag, getFlag, parse };
