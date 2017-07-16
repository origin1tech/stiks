export declare type CopyTuple = [string, string];
export interface IMap<T> {
    [key: string]: T;
}
export interface ICopy {
    src: string;
    dest: string;
}
export interface ISemverMax {
    major: number;
    minor: number;
    patch: number;
}
