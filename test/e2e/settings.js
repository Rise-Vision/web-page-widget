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
      invalidUrl = "http://w";

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    describe("Initialization", function () {
      it("Should load URL Field component", function () {
        expect(element(by.css("#pageUrl input[name='url']")).isPresent()).to.eventually.be.true;
      });

      it("Should load Save button", function () {
        expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
      });

      it("Should load Cancel button", function () {
        expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;
      });
    });

    describe("Defaults", function () {

      it("Should apply empty value for URL Field", function () {
        expect(element(by.css("#pageUrl input[name='url']")).getAttribute("value")).to.eventually.equal("");
      });

      it("Should apply form as invalid due to URL Field empty entry", function () {
        expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;
      });

      it("Should disable Save button", function () {
        expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      });

      it("Should not show warning message regarding X-Frame-Options feed", function () {
        expect(element(by.css("#pageUrl + p.text-danger")).isPresent()).to.eventually.be.false;
      });

    });

    describe("Warning message", function() {
      it("should not show warning when URL Field is receiving input", function() {
        element(by.css("#pageUrl input[name='url']")).sendKeys("http://test");

        expect(element(by.css("#pageUrl + p.text-danger")).isPresent()).to.eventually.be.false;
      });

      it("should show warning message when a webpage with X-Frame-Options header is present", function () {
        element(by.css("#pageUrl input[name='url']")).sendKeys("http://www.google.com");
        // remove focus
        element(by.css("h3.modal-title")).click();

        expect(element(by.css("#pageUrl + p.text-danger")).isPresent()).to.eventually.be.true;
      });

      it("should not show warning message when a webpage doesn't specify X-Frame-Options header", function () {
        element(by.css("#pageUrl input[name='url']")).sendKeys("http://www.risevision.com");
        // remove focus
        element(by.css("h3.modal-title")).click();

        expect(element(by.css("#pageUrl + p.text-danger")).isPresent()).to.eventually.be.false;
      });
    });

    describe("Saving", function () {

      it("Should enable Save button due to valid URL entry", function () {
        element(by.css("#pageUrl input[name='url']")).sendKeys(validUrl);

        // save button should be enabled
        expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

        // form should be valid due to URL Field empty entry
        expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.false;
      });

      it("Should be invalid form and Save button disabled due to invalid URL", function () {
        element(by.css("#pageUrl input[name='url']")).sendKeys(invalidUrl);

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

        element(by.css("#pageUrl input[name='url']")).sendKeys(validUrl);

        element(by.id("save")).click();

        expect(browser.executeScript("return window.result")).to.eventually.deep.equal(
          {
            'additionalParams': JSON.stringify(settings.additionalParams),
            'params': ''
          });
      });
    });

  });

})();
