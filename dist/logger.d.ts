/**
 * Just a wrapper to Timbr
 * for backward compatibility.
 */
import { Timbr } from 'timbr';
declare const get: (options?: any) => Timbr;
export { get, Timbr };
