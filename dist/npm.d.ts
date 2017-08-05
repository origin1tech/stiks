import { INpmInstallOptions, INpmUninstallOptions, INpmListOptions, INpmOptions } from './interfaces';
/**
 * Install
 * Spawns process and installs packages.
 *
 * @param packages the packages to be installed.
 * @param options options to use when installing.
 */
export declare function install(packages: string | string[], options: INpmInstallOptions): void;
/**
 * Uninstall
 * Spawns process and uninstalls packages.
 *
 * @param packages the packages to be uninstalled.
 * @param options options to use when uninstalling.
 */
export declare function uninstall(packages: string | string[], options: INpmUninstallOptions): void;
/**
 * List
 * Displays list/tree of project packages.
 *
 * @param pkg optional package to be listed.
 * @param options list options.
 */
export declare function list(pkg: string | INpmListOptions, options: INpmListOptions): void;
/**
 * Run
 * Calls npm run-script from your package.json.
 *
 * @param script the script to be run.
 * @param options optional flags to run with script.
 */
export declare function run(script: string, options: INpmOptions): void;
export declare function command(cmd: string, args?: string | string[], options?: INpmOptions, defaults?: boolean): void;
