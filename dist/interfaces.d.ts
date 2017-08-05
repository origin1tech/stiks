/// <reference types="node" />
import { CpuInfo } from 'os';
export declare type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
export declare type NodeCallback = (err?: Error, data?: any) => void;
export declare type NodeAnyCallback = (...args: any[]) => void;
export declare type CopyTuple = [string, string];
export declare type StringBuilderAdd = (str: any, styles: string | string[]) => IStringBuilderMethods;
export declare type StringBuilderRender = (char?: string) => string;
export declare type StringBuilderJoin = (char?: string) => IStringBuilderMethods;
export declare type StringBuilderFormat = (...args: any[]) => IStringBuilderMethods;
export interface IMap<T> {
    [key: string]: T;
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
export interface INpmFlags {
    [key: string]: any;
}
export interface INpmOptions extends INpmFlags {
    cwd?: string;
    global?: boolean;
    stdio?: any;
}
export interface INpmInstallOptions extends INpmOptions {
    save?: boolean;
    'save-dev'?: boolean;
    'ignore-scripts'?: boolean;
}
export interface INpmUninstallOptions extends INpmOptions {
    save?: boolean;
    'save-dev'?: boolean;
}
export interface INpmListOptions extends INpmOptions {
    global?: boolean;
    depth?: number;
}
