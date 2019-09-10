/*!
 * absurdUID.js v0.0.1
 * https://github.com/torstendittmann/absurdUID
 *
 * Copyright (c) 2019 Torsten Dittmann
 * Released under the MIT license
 */

 /**
  * Generates a unique string based on the UNIX timestamp and the runtime.
  */
 function absurdUID() {
    return new Date().getTime().toString().concat(performance.now());
}
