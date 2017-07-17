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
