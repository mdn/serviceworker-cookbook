/*
 * @global Logger
 * Logging helper
 */
var Logger = {

  /*
   * @readonly logDomObj
   * The HTML DOM Object to log to
   */
  logDomObj: document.querySelector('#log'),

  /*
   * @method debug
   * Debug log
   * @param {String} message The message to be logged
   */
  debug: function debug(message) {
    this.writeLog(message, { debug: true });
  },

  /*
   * @method info
   * Info log
   * @param {String} message The message to be logged
   */
  info: function info(message) {
    this.writeLog(message, { info: true });
  },

  /*
   * @method log
   * Default log
   * @param {String} message The message to be logged
   */
  log: function log(message) {
    this.writeLog(message);
  },

  /*
   * @method warn
   * Warning log
   * @param {String} message The message to be logged
   */
  warn: function warn(message) {
    this.writeLog(message, { warn: true });
  },

  /*
   * @method error
   * Error log
   * @param {String} message The message to be logged
   */
  error: function error(message) {
    this.writeLog(message, { error: true });
  },

  /*
   * @method writeLog
   * Log to the browser console and the HTML log
   * @param {String} message The message to be logged
   * @param {Object} level The log level (error, warn, info, log, debug) Default: level.log
   */
  writeLog: function writeLog(message, level) {
    var logMessage = document.createElement('div');

    if (message) {
      // add message to the HTML node
      logMessage.innerHTML = message;
    } else {
      // make sure to log all messages on the HTML log
      if (message === null) {
        logMessage.innerHTML = 'null';
      } else if (message === undefined) {
        logMessage.innerHTML = 'undefined';
      }
    }

    // level check
    if (level) {
      if (level.error) {
        logMessage.setAttribute('class', 'error');
        console.error(message);
      } else if (level.warn) {
        logMessage.setAttribute('class', 'warning');
        console.warn(message);
      } else if (level.info) {
        logMessage.setAttribute('class', 'info');
        console.info(message);
      } else if (level.debug) {
        logMessage.setAttribute('class', 'debug');
        console.debug(message);
      }
    } else {
      // log into the browser console
      console.log(message);
    }

    // log into the HTML console
    this.logDomObj.appendChild(logMessage);
    this.logDomObj.scrollTop = this.logDomObj.scrollHeight;
  },

  /*
   * @method newSection
   * Log a section separator to the browser console and the HTML log
   */
  newSection: function newSection() {
    var separator = '----------';
    var newLine = document.createElement('div');
    newLine.innerHTML = separator;
    this.logDomObj.appendChild(newLine);
    console.log(separator);
  },
};

Logger.newSection();
