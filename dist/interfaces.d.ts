export declare type CopyTuple = [string, string];
export interface IMap<T> {
    [key: string]: T;
}
export interface ICopy {
    src: string;
    dest: string;
}
export interface ITSNodeOptions {
    fast?: boolean | null;
    cache?: boolean | null;
    cacheDirectory?: string;
    compiler?: string;
    project?: boolean | string;
    ignore?: boolean | string | string[];
    ignoreWarnings?: number | string | Array<number | string>;
    disableWarnings?: boolean | null;
    getFile?: (path: string) => string;
    fileExists?: (path: string) => boolean;
    compilerOptions?: any;
}
export declare type NpmCommand = (...args: any[]) => any;
export interface INpmCommands {
    access: NpmCommand;
    adduser: NpmCommand;
    bin: NpmCommand;
    bugs: NpmCommand;
    c: NpmCommand;
    cache: NpmCommand;
    completion: NpmCommand;
    config: NpmCommand;
    ddp: NpmCommand;
    dedupe: NpmCommand;
    deprecate: NpmCommand;
    'dist-tag': NpmCommand;
    docs: NpmCommand;
    edit: NpmCommand;
    explore: NpmCommand;
    get: NpmCommand;
    list: NpmCommand;
    ln: NpmCommand;
    login: NpmCommand;
    logout: NpmCommand;
    ls: NpmCommand;
    outdated: NpmCommand;
    owner: NpmCommand;
    pack: NpmCommand;
    prefix: NpmCommand;
    prune: NpmCommand;
    publish: NpmCommand;
    rb: NpmCommand;
    rebuild: NpmCommand;
    repo: NpmCommand;
    restart: NpmCommand;
    root: NpmCommand;
    run: NpmCommand;
    'run-script': NpmCommand;
    s: NpmCommand;
    se: NpmCommand;
    search: NpmCommand;
    set: NpmCommand;
    shrinkwrap: NpmCommand;
    star: NpmCommand;
    stars: NpmCommand;
    start: NpmCommand;
    stop: NpmCommand;
    t: NpmCommand;
    tag: NpmCommand;
    team: NpmCommand;
    test: NpmCommand;
    tst: NpmCommand;
    un: NpmCommand;
    uninstall: NpmCommand;
    unpublish: NpmCommand;
    unstar: NpmCommand;
    up: NpmCommand;
    update: NpmCommand;
    v: NpmCommand;
    version: NpmCommand;
    view: NpmCommand;
    whoami: NpmCommand;
}
