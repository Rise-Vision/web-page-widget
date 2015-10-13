var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(msg) {
  this.echo(msg);
});

casper.test.begin("Web Page Widget - Integration Testing", {

  setUp: function (test) {
    casper.options.clientScripts = [
      "test/data/refresh.js",
      "node_modules/sinon/pkg/sinon.js"
    ]
  },
  test: function(test) {
    var clock;

    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Web Page Widget", "Test page has loaded");
    });

    casper.then(function () {
      casper.evaluate(function () {
        var evt = document.createEvent("CustomEvent");

        clock = sinon.useFakeTimers();

        evt.initCustomEvent("WebComponentsReady", false, false);
        window.dispatchEvent(evt);
      });

      casper.waitFor(function waitForUI() {
          return this.evaluate(function checkFrame() {
            return document.getElementById("webpage-frame").getAttribute("src") !== "";
          });
        },
        function then() {
          test.assertMatch(this.getElementAttribute("#webpage-frame", "src"), /dummyVar=/,
            "Should include cachebuster");
        });
    });

    casper.withFrame(0, function () {
      test.comment("Testing within iframe");

      test.assertUrlMatch(/dummyVar=/, "Should include cachebuster for website loaded");
    });

    casper.run(function () {
      test.done();
    });
  }

});
