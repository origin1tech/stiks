/// <reference types="node" />
import { CpuInfo } from 'os';
import { SpawnSyncOptions } from 'child_process';
export declare type NodeCallback = (err?: Error, data?: any) => void;
export declare type NodeAnyCallback = (...args: any[]) => void;
export declare type CopyTuple = [string, string];
export interface IMap<T> {
    [key: string]: T;
}
export interface ICopy {
    src: string;
    dest: string;
}
export declare type NpmCommand = (...args: any[]) => any;
export interface ICpu extends CpuInfo {
    cores?: number;
}
export interface IExecMethods {
    command(cmd: string, args: string | string[], options?: boolean | SpawnSyncOptions): any;
    node(args: string | string[], options?: boolean | SpawnSyncOptions): any;
    npm(args: string | string[], options?: boolean | SpawnSyncOptions): any;
    git(args: string | string[], options?: boolean | SpawnSyncOptions): any;
}
export interface ILogger {
    (...args: any[]): void;
    colors: IMap<string>;
    colorize: boolean;
    error(...args: any[]): ILogger;
    warn(...args: any[]): ILogger;
    info(...args: any[]): ILogger;
    exit(code?: any): void;
}
