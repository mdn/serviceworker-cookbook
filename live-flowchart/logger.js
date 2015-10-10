
var Logger = {

	logDomObj: document.querySelector('#log'),

	log: function(message, highlight) {
		console.log(message);

		var logMessage = document.createElement('div');

		if (highlight) {
			logMessage.setAttribute('class', 'highlight');
		}

		logMessage.innerHTML = message;

		if (Object.prototype.toString.call(message) === '[object String]'
			&& message.includes('\n')) {

			var newLine = document.createElement('div');
			newLine.innerHTML = "&nbsp;";
			this.logDomObj.appendChild(newLine);
		}

		this.logDomObj.appendChild(logMessage);
	},

	highlight: function(message) {
		this.log(message, true);
	}
}
