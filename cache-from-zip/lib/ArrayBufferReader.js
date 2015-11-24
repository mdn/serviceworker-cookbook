/* global zip */

(function (zip) {
  'use strict';

  function ArrayBufferReader(arraybuffer) {
    var that = this;

    this.init = init;
    this.readUint8Array = readUint8Array;

    function init(callback, onerror) {
      try {
        that.data = new Uint8Array(arraybuffer);
        that.size = that.data.length;
        callback();
      } catch (e) {
        onerror(e);
      }
    }

    function readUint8Array(index, length, callback, onerror) {
      callback(new Uint8Array(that.data.subarray(index, index + length)));
    }
  }
  ArrayBufferReader.prototype = new zip.Reader();
  ArrayBufferReader.prototype.constructor = ArrayBufferReader;

  zip.ArrayBufferReader = ArrayBufferReader;
}(zip));
