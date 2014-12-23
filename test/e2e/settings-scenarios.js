/* jshint expr: true */

(function () {
  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Web Page Settings - e2e Testing", function() {
    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load all components", function () {
      // Widget Button Toolbar
      expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
      expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;

      // URL Field
      expect(element(by.css("#urlField input[name='url']")).isPresent()).to.eventually.be.true;

      // Background Setting
      expect(element(by.css("#background .section")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly load default settings", function () {
      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;

      // form should be invalid due to URL Field empty entry
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;

      // URL Field input value should be empty
      expect(element(by.css("#urlField input[name='url']")).getAttribute("value")).to.eventually.equal("");

      // Scrollbars checkbox should be displayed
      expect(element(by.css("input[name='scrollbars']")).isDisplayed()).to.eventually.be.true;

      expect(element(by.model("settings.additionalParams.scrollHorizontal")).getAttribute("value")).to.eventually.equal("0");
      expect(element(by.model("settings.additionalParams.scrollVertical")).getAttribute("value")).to.eventually.equal("0");
      expect(element(by.model("settings.additionalParams.zoom")).getAttribute("value")).to.eventually.equal("1");
      expect(element(by.model("settings.additionalParams.interactive")).isSelected()).to.eventually.be.true;
      expect(element(by.model("settings.additionalParams.scrollbars")).isSelected()).to.eventually.be.true;
      expect(element(by.model("settings.additionalParams.refresh")).getAttribute("value")).to.eventually.equal("0");
    });

    it("Should enable Save button due to valid URL entry", function () {
      element(by.css("#urlField input[name='url']")).sendKeys("http://www.valid-url.com");

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

      // form should be valid due to URL Field empty entry
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.false;
    });

    it("Should be invalid form due to non-numeric entry of Scroll Horizontal", function () {
      element(by.css("#urlField input[name='url']")).sendKeys("http://www.valid-url.com");

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

      element(by.css("input[name='scrollHorizontal']")).sendKeys("abc");

      // form should be invalid
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
    });

    it("Should be invalid form due to non-numeric entry of Scroll Vertical", function () {
      element(by.css("#urlField input[name='url']")).sendKeys("http://www.valid-url.com");

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

      element(by.css("input[name='scrollVertical']")).sendKeys("abc");

      // form should be invalid
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
    });

    it("Should hide Scrollbars checkbox and ensure value of false when Interactive checkbox de-selected", function () {
      element(by.css("input[name='interactive']")).click();

      // Scrollbars checkbox should be hidden
      expect(element(by.css("input[name='scrollbars']")).isDisplayed()).to.eventually.be.false;

      // Model value should be false
      expect(element(by.model("settings.additionalParams.scrollbars")).isSelected()).to.eventually.be.false;
    });

    it("Should disable Scrollbars checkbox if Zoom selection is > 100%", function () {
      element(by.css("select#zoom")).click();
      element(by.css("select#zoom option[value='1.25']")).click();

      // Expect Scrollbars checkbox to be disabled
      expect(element(by.css("input[name='scrollbars'][disabled='disabled']")).isPresent()).to.eventually.be.true;

      // Model value should be false
      expect(element(by.model("settings.additionalParams.scrollbars")).isSelected()).to.eventually.be.false;
    });

    it("Should correctly save settings", function (done) {
      var testUrl = "http://www.risevision.com";
      var settings = {
        params: {},
        additionalParams: {
          url: testUrl,
          scrollHorizontal: 0,
          scrollVertical: 0,
          zoom: 1,
          interactive: false,
          scrollbars: false,
          refresh: 0,
          background: {
            color: "transparent"
          }
        }
      };

      element(by.css("#urlField input[name='url']")).sendKeys(testUrl);

      element(by.css("input[name='interactive']")).click();

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal(
        {
          'additionalParams': JSON.stringify(settings.additionalParams),
          'params': ''
        });
    });

  });

})();
