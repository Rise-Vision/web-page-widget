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
    var validUrl = "http://www.valid-url.com",
      invalidUrl = "http://w",
      validImageUrl = validUrl + "/image.jpg",
      invalidImageUrl = validUrl + "/image.pdf";

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load all components", function () {
      // Widget Button Toolbar
      expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
      expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;

      // URL Field
      expect(element(by.css("#urlField input[name='url']")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly load default settings", function () {
      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;

      // form should be invalid due to URL Field empty entry
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;

      // URL Field input value should be empty
      expect(element(by.css("#urlField input[name='url']")).getAttribute("value")).to.eventually.equal("");
    });

    it("Should enable Save button due to valid URL entry", function () {
      element(by.css("#urlField input[name='url']")).sendKeys(validUrl);

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

      // form should be valid due to URL Field empty entry
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.false;
    });

    it("Should be invalid form and Save button disabled due to invalid URL", function () {
      element(by.css("#urlField input[name='url']")).sendKeys(invalidUrl);

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;

      // form should be invalid due to invalid URL
      expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly save settings", function () {
      var settings = {
        params: {},
        additionalParams: {
          url: validUrl
        }
      };

      element(by.css("#urlField input[name='url']")).sendKeys(validUrl);

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal(
        {
          'additionalParams': JSON.stringify(settings.additionalParams),
          'params': ''
        });
    });

  });

})();
