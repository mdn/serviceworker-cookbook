
/*
 * @global Logger
 * Logging helper
 */
var Logger = {

  logDomObj: document.querySelector('#log'),

  log: function log(message, level) {
    var logMessage = null;
    var newLine = null;

    logMessage = document.createElement('div');

    if (message) {
      // add message to the HTML node
      logMessage.innerHTML = message;

      // new like check
      if (Object.prototype.toString.call(message) === '[object String]'
        && message.indexOf('\n') !== -1) { // message.includes('\n')
        newLine = document.createElement('div');
        newLine.innerHTML = '&nbsp;';
        this.logDomObj.appendChild(newLine);
      }
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

  debug: function debug(message) {
    this.log(message, { debug: true });
  },

  info: function info(message) {
    this.log(message, { info: true });
  },

  warn: function warn(message) {
    this.log(message, { warn: true });
  },

  error: function error(message) {
    this.log(message, { error: true });
  },
};

Logger.log('Logger initialised');
