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

      it("Should apply 100% value for Zoom", function () {
        expect(element(by.model('settings.additionalParams.zoom')).getAttribute("value")).to.eventually.equal("1");
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

      it("Should select 'Show Entire Page'", function () {
        expect(element(by.css("input[type='radio'][value='page']")).isSelected()).to.eventually.be.true;
      });

    });

    describe("Visibility", function() {
      it("Should not show scroll settings if 'Show Entire Page' is selected", function() {
        expect(element(by.model("settings.additionalParams.region.horizontal")).isDisplayed()).to.eventually.be.false;
        expect(element(by.model("settings.additionalParams.region.vertical")).isDisplayed()).to.eventually.be.false;
      });

      it("Should show scroll settings if 'Show a Region' is selected", function() {
        element(by.css("input[type='radio'][value='region']")).click();

        expect(element(by.model("settings.additionalParams.region.horizontal")).isDisplayed()).to.eventually.be.true;
        expect(element(by.model("settings.additionalParams.region.vertical")).isDisplayed()).to.eventually.be.true;
      });

      it("Should set default value for 'Refresh'", function () {
        element.all(by.css("select[name='refresh'] option")).then(function (elements) {
          expect(elements.length).to.equal(5);
        });

        expect(element(by.model("settings.additionalParams.refresh")).getAttribute("value")).to.eventually.equal("0");
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

      it("Should be able to set the zoom to 50%", function () {
        element(by.cssContainingText('option', '50%')).click();

        expect(element(by.model('settings.additionalParams.zoom')).getAttribute("value")).to.eventually.equal("0.50");
      });

      it("Should correctly save settings", function () {
        var settings = {
          params: {},
          additionalParams: {
            url: validUrl,
            refresh: 0,
            region: {
              showRegion: "page",
              horizontal: 0,
              vertical: 0
            },
            zoom: 1
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
