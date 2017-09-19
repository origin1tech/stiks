/// <reference types="node" />
import { CpuInfo } from 'os';
import { SpawnSyncOptions } from 'child_process';
export declare type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
export declare type NodeCallback = (err?: Error, data?: any) => void;
export declare type NodeAnyCallback = (...args: any[]) => void;
export declare type LogCallback = (type: string, msg: string, meta: IMap<any>, info: {
    timestamp: string;
    args: any[];
    stackTrace?: IStacktraceFrame[];
    error?: Error;
}) => void;
export declare type CopyTuple = [string, string];
export declare type StringBuilderAdd = (str: any, styles: string | string[]) => IStringBuilderMethods;
export declare type StringBuilderRender = (char?: string) => string;
export declare type StringBuilderJoin = (char?: string) => IStringBuilderMethods;
export declare type StringBuilderFormat = (...args: any[]) => IStringBuilderMethods;
export declare type Colors = 'white' | 'black' | 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'gray';
export interface IMap<T> {
    [key: string]: T;
}
export interface IMapAny {
    [key: string]: any;
}
export interface ICopy {
    src: string;
    dest: string;
}
export interface IStringBuilderMethods {
    add: StringBuilderAdd;
    join: StringBuilderJoin;
    format: StringBuilderFormat;
    render: StringBuilderRender;
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
export interface IUIOptions {
    text: string;
    width?: number;
    padding?: number | number[];
    align?: string;
    border?: boolean;
}
export interface ICpu extends CpuInfo {
    cores?: number;
}
export interface IExecMethods {
    command(cmd: string, args: string | string[], options?: boolean | SpawnSyncOptions): any;
    node(args: string | string[], options?: boolean | SpawnSyncOptions): any;
    npm(args: string | string[], options?: boolean | SpawnSyncOptions): any;
}
export interface ILoggerOptions {
    stream?: NodeJS.WritableStream;
    level?: string | number;
    depth?: number;
    colors?: boolean;
    errorExit?: boolean;
    errorCapture?: boolean;
    stackTrace?: boolean;
    prettyStack?: boolean;
    miniStack?: boolean;
    timestamp?: boolean | 'date' | 'time';
    colorMap?: {
        error?: Colors;
        warn?: Colors;
        info?: Colors;
        debug?: Colors;
    };
    onLogged?: LogCallback;
}
export interface IStacktraceFrame {
    method: string;
    filename: string;
    relative: string;
    line: number;
    column: number;
}
export interface IStacktraceResult {
    frames: IStacktraceFrame[];
    stack: string[];
    miniStack: string;
}
