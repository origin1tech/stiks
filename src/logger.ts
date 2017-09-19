/**
 * Just a wrapper to Timbr
 * for backward compatibility.
 */

import { Timbr, ITimbrOptions } from 'timbr';

let instance: Timbr;

const get = (options?): Timbr => {
  if (instance)
    return instance;
  return new Timbr(options);
};

export { get, Timbr };