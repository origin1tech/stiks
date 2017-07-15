/**
 * Nothing fancy just prevents
 * a full blown dependency for
 * simple process of bumping
 * semver before commit/pub.
 */
/************************/
declare const pkg: any;
declare const fs: any;
declare const argv: string[];
declare const maxPatch = 999;
declare const maxMinor = 99;
declare const maxMajor = 0;
declare let ver: any;
declare let verArr: any[];
declare function isTruthy(val: any): boolean;
declare function tryParseInt(num: any): number | false;
declare function parseVer(idx: any, set?: any, setting?: any): any;
declare const verMap: {
    major: number;
    minor: number;
    patch: number;
};
declare function setVersion(type: any, ver?: any): any;
declare const hasMajor: any;
declare const hasMinor: any;
declare const hasPatch: any;
declare const setMajor: any;
declare const setMinor: any;
declare const setPatch: any;
