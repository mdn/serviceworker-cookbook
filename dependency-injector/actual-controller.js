/* global dialogs */

document.getElementById('show-alert').onclick =
  dialogs.alert.bind(dialogs, 'Hello!');

document.getElementById('show-confirm').onclick =
  dialogs.confirm.bind(dialogs, 'Do you like these demos?');

document.getElementById('show-prompt').onclick =
  dialogs.prompt.bind(dialogs, 'Enter your rate about these demos:');
