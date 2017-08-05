
import { CpuInfo } from 'os';
import { } from 'child_process';

export type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
export type NodeCallback = (err?: Error, data?: any) => void;
export type NodeAnyCallback = (...args: any[]) => void;
export type CopyTuple = [string, string];
export type StringBuilderAdd = (str: any, styles: string | string[]) => IStringBuilderMethods;
export type StringBuilderRender = (char?: string) => string;
export type StringBuilderJoin = (char?: string) => IStringBuilderMethods;
export type StringBuilderFormat = (...args: any[]) => IStringBuilderMethods;

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

export type NpmCommand = (...args: any[]) => any;

// export interface INpmCommands {

//  access, adduser, bin, bugs, c, cache, completion, config,
//   ddp, dedupe, deprecate, dist-tag, docs, edit, explore, get,
//   help, help-search, i, init, install, install-test, it, link,
//   list, ln, login, logout, ls, outdated, owner, pack, ping,
//   prefix, prune, publish, rb, rebuild, repo, restart, root,
//   run, run-script, s, se, search, set, shrinkwrap, star,
//   stars, start, stop, t, tag, team, test, tst, un, uninstall,
//   unpublish, unstar, up, update, v, version, view, whoami

// access: NpmCommand;
// adduser: NpmCommand;
// bin: NpmCommand;
// bugs: NpmCommand;
// c: NpmCommand;
// cache: NpmCommand;
// completion: NpmCommand;
// config: NpmCommand;
// ddp: NpmCommand;
// dedupe: NpmCommand;
// deprecate: NpmCommand;
// 'dist-tag': NpmCommand;
// docs: NpmCommand;
// edit: NpmCommand;
// explore: NpmCommand;
// get: NpmCommand;
// install: NpmCommand;
// list: NpmCommand;
// ln: NpmCommand;
// login: NpmCommand;
// logout: NpmCommand;
// ls: NpmCommand;
// outdated: NpmCommand;
// owner: NpmCommand;
// pack: NpmCommand;
// prefix: NpmCommand;
// prune: NpmCommand;
// publish: NpmCommand;
// rb: NpmCommand;
// rebuild: NpmCommand;
// repo: NpmCommand;
// restart: NpmCommand;
// root: NpmCommand;
// run: NpmCommand;
// 'run-script': NpmCommand;
// s: NpmCommand;
// se: NpmCommand;
// search: NpmCommand;
// set: NpmCommand;
// shrinkwrap: NpmCommand;
// star: NpmCommand;
// stars: NpmCommand;
// start: NpmCommand;
// stop: NpmCommand;
// t: NpmCommand;
// tag: NpmCommand;
// team: NpmCommand;
// test: NpmCommand;
// tst: NpmCommand;
// un: NpmCommand;
// uninstall: NpmCommand;
// unpublish: NpmCommand;
// unstar: NpmCommand;
// up: NpmCommand;
// update: NpmCommand;
// v: NpmCommand;
// version: NpmCommand;
// view: NpmCommand;
// whoami: NpmCommand;

// }

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
