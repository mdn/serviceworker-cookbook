
const Logger = {

  logDomObj: document.querySelector('#log'),

  log: function log(message, level) {
    var logMessage = null;
    var newLine = null;

    logMessage = document.createElement('div');
    logMessage.innerHTML = message;

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
      console.log(message);
    }

    if (Object.prototype.toString.call(message) === '[object String]' && message.includes('\n')) {
      newLine = document.createElement('div');
      newLine.innerHTML = '&nbsp;';
      this.logDomObj.appendChild(newLine);
    }

    this.logDomObj.appendChild(logMessage);
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
