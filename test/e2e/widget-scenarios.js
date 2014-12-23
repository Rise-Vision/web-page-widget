casper.test.begin("Web Page Widget - e2e Testing", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;

  casper.options.waitTimeout = 1000;

  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html",
    function () {
      test.assertTitle("Web Page Widget");
    }
  );

  casper.then(function() {

    test.assertExists("#webpage-frame", "Should ensure iframe is present");

    test.assertMatch(this.getElementAttribute("#webpage-frame", "src"),
      /risevision\.com/, "Should be correct src value for iframe");

    test.assertEquals(this.getElementAttribute("#webpage-frame", "scrolling"),
      "yes", "Should be correct scrolling value for iframe");

    test.assertEval(function () {
      var hasStyle = false,
        el = document.querySelector("#webpage-container"),
        style = document.defaultView.getComputedStyle(el, null).getPropertyValue("padding-bottom");

      if(style !== '' && style !== null) {
        hasStyle = true;
      }

      return hasStyle;
    }, "Should apply padding-bottom to webpage-container div");

    test.assertEquals(this.evaluate(function(i, p){
      return document.querySelector(i).style[p];
    }, ".blocker", "display"), "none", "Should not display the blocker div");
  });

  casper.withFrame(0, function() {
    test.comment("Testing within iframe");

    test.assertUrlMatch(/risevision\.com/, "Should be correct url of website loaded");
    test.assertVisible("a[href='http://www.risevision.com']",
      "Should contain Rise Vision logo to verify content is rendered");
  });

  casper.run(function() {
    test.done();
  });
});
