(function(window) {
  // The module mock dialogs exports a non blocking fake implementation
  // that simply logs the calls.
  window.dialogs = {
    alert: function(msg) {
      console.log('alert:', msg);
    },

    confirm: function(msg) {
      console.log('confirm:', msg);
      return true;
    },

    prompt: function(msg) {
      console.log('prompt:', msg);
      return 'test';
    }
  };
})(window);
