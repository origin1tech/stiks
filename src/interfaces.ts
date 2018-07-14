
import { CpuInfo } from 'os';
import { SpawnSyncOptions } from 'child_process';
import { EventEmitter } from 'events';

export type NodeCallback = (err?: Error, data?: any) => void;
export type NodeAnyCallback = (...args: any[]) => void;
export type CopyTuple = [string, string];

export interface IMap<T> {
  [key: string]: T;
}

export interface ICopy {
  src: string;
  dest: string;
}

export type NpmCommand = (...args: any[]) => any;

export interface ICpu extends CpuInfo {
  cores?: number;
}

export interface IExecMethods {
  command(cmd: string, args: string | string[], options?: boolean | SpawnSyncOptions);
  node(args: string | string[], options?: boolean | SpawnSyncOptions);
  npm(args: string | string[], options?: boolean | SpawnSyncOptions);
  git(args: string | string[], options?: boolean | SpawnSyncOptions);
}

export interface ILogger {
  (...args: any[]): void;
  colors: IMap<string>;
  colorize: boolean;
  error(...args: any[]): ILogger;
  warn(...args: any[]): ILogger;
  info(...args: any[]): ILogger;
  notify(...args: any[]): ILogger;
  exit(code?): void;
}

export interface IGroupedQueueOptions {
  once?: string;
  run?: boolean;
}
export interface IGroupedQueue extends EventEmitter {
  (subQueues?: string | string[]): IGroupedQueue;
  add(name?: string, task?: Function, options?: IGroupedQueueOptions): void;
  run(): void;
}