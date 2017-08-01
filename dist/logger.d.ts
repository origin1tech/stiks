declare const methods: {
    error: (err: any) => any;
    warn: any;
    info: any;
    debug: any;
    write: (...args: any[]) => any;
    exit: (code?: number) => never;
    depth: (depth?: number) => number;
    level: (level?: number) => number;
};
export = methods;
