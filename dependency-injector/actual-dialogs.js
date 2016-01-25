(function(window) {
  // The real implementation of dialog rely on the browser dialogs but it could
  // implement their own full HTML5 UI.
  window.dialogs = {
    alert: function(msg) {
      window.alert(msg);
    },

    confirm: function(msg) {
      return window.confirm(msg);
    },

    prompt: function(msg) {
      return window.prompt(msg);
    }
  };
})(window);
