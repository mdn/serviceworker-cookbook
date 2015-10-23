
// <h2>Logger</h2>
// Helper to log to the browser console and an HTML log
var Logger = {

  // The HTML DOM Object to log to
  logDomObj: document.querySelector('#log'),

  // <h3>Debug log</h3>
  // Log using a <code>debug</code> style
  debug: function debug(message) {
    this.writeLog(message, { debug: true });
  },

  // <h3>Info log</h3>
  // Log using a <code>info</code> style
  info: function info(message) {
    this.writeLog(message, { info: true });
  },

  // <h3>Default log</h3>
  // Log using a <code>log</code> style
  log: function log(message) {
    this.writeLog(message);
  },

  // <h3>Warning log</h3>
  // Log using a <code>warning</code> style
  warn: function warn(message) {
    this.writeLog(message, { warn: true });
  },

  // <h3>Error log</h3>
  // Log using a <code>error</code> style
  error: function error(message) {
    this.writeLog(message, { error: true });
  },

  // <h3>New section</h3>
  // Log a section separator to the browser console and the HTML log
  newSection: function newSection() {
    var separator = '----------';
    var newLine = document.createElement('div');
    newLine.innerHTML = separator;
    this.logDomObj.appendChild(newLine);
    console.log(separator);
  },

  // <h3>Write log</h3>
  // Internal method to log to the browser console and the HTML log
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

};

// log a new section
Logger.newSection();
