/**
 * Just a wrapper to Timbr
 * for backward compatibility.
 */
import { Timbr, ITimbrOptions } from 'timbr';
declare const get: (options?: ITimbrOptions) => Timbr;
export { get, Timbr };
