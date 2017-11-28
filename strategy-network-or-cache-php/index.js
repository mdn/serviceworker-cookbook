navigator.serviceWorker.register('sw.js', {
    scope: './cached'
})

var reload = function() {
    document.getElementById("icache").contentWindow.location.reload();
    document.getElementById("inocache").contentWindow.location.reload();
};

navigator.serviceWorker.ready = reload;

document.getElementById("btnReload").onclick = reload;


