
const Logger = {

  logDomObj: document.querySelector('#log'),

  log: function log(message, highlight) {
    var logMessage = null;
    var newLine = null;

    console.log(message);

    logMessage = document.createElement('div');

    if (highlight) {
      logMessage.setAttribute('class', 'highlight');
    }

    logMessage.innerHTML = message;

    if (Object.prototype.toString.call(message) === '[object String]' && message.includes('\n')) {
      newLine = document.createElement('div');
      newLine.innerHTML = '&nbsp;';
      this.logDomObj.appendChild(newLine);
    }

    this.logDomObj.appendChild(logMessage);
  },

  highlight: function highlight(message) {
    this.log(message, true);
  },
};
