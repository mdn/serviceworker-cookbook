// This file is required to make the "app" work offline

document.getElementById('randomButton').addEventListener('click', function() {
  var image = document.getElementById('logoImage');
  var currentIndex = Number(image.src.match('random-([0-9])')[1]);
  var newIndex = getRandomNumber();

  // Ensure that we receive a different image than the current
  while (newIndex === currentIndex) {
    newIndex = getRandomNumber();
  }

  image.src = 'random-' + newIndex + '.png';

  function getRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }
});

document.getElementById('clearAndReRegister').addEventListener('click',
  function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.unregister();
      window.location.reload();
    });
  }
);
