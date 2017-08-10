
import { CpuInfo } from 'os';
import { SpawnSyncOptions } from 'child_process';

export type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
export type NodeCallback = (err?: Error, data?: any) => void;
export type NodeAnyCallback = (...args: any[]) => void;
export type LogCallback = (type: string, args: any[], stackTrace: IStacktraceResult, error: Error) => void;
export type CopyTuple = [string, string];
export type StringBuilderAdd = (str: any, styles: string | string[]) => IStringBuilderMethods;
export type StringBuilderRender = (char?: string) => string;
export type StringBuilderJoin = (char?: string) => IStringBuilderMethods;
export type StringBuilderFormat = (...args: any[]) => IStringBuilderMethods;

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

export type NpmCommand = (...args: any[]) => any;

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
  command(cmd: string, args: string | string[], options?: boolean | SpawnSyncOptions);
  node(args: string | string[], options?: boolean | SpawnSyncOptions);
  npm(args: string | string[], options?: boolean | SpawnSyncOptions);
}

export interface ILoggerOptions {
  stream?: NodeJS.WritableStream;
  level?: string;
  depth?: number;
  colors?: boolean;
  errorExit?: boolean;
  errorCapture?: boolean;
  stackTrace?: boolean;
  prettyStack?: boolean;
  miniStack?: boolean;
  timestamp?: boolean | 'date' | 'time';
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