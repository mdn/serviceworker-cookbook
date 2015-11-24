(function(window){
  'use strict';

  // The module mock dialogs exports a non blocking fake implementation
  // that simply logs the calls.
  window.dialogs = {
    alert: function (mssg) {
      console.log('alert:', mssg);
    },

    confirm: function (mssg) {
      console.log('confirm:', mssg);
      return true;
    },

    prompt: function (mssg) {
      console.log('prompt:', mssg);
      return 'test';
    }
  };
}(window));
