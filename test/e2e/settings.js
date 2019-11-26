/* global require, browser, describe, beforeEach, it, element, by */

/* eslint-disable func-names */

( function() {
  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require( "chai" ),
    chaiAsPromised = require( "chai-as-promised" ),
    expect;

  chai.use( chaiAsPromised );
  expect = chai.expect;

  describe( "Web Page Settings - e2e Testing", function() {
    var validUrl = "http://www.valid-url.com",
      invalidUrl = "http://w";

    beforeEach( function() {
      browser.get( "/src/settings-e2e.html" );
    } );

    describe( "Initialization", function() {
      it( "Should load URL Field component", function() {
        expect( element( by.css( "#pageUrl input[name='url']" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should load Save button", function() {
        expect( element( by.css( "button#save" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should load Cancel button", function() {
        expect( element( by.css( "button#cancel" ) ).isPresent() ).to.eventually.be.true;
      } );
    } );

    describe( "Defaults", function() {

      it( "Should apply empty value for URL Field", function() {
        expect( element( by.css( "#pageUrl input[name='url']" ) ).getAttribute( "value" ) ).to.eventually.equal( "" );
      } );

      it( "Should apply 100% value for Zoom", function() {
        expect( element( by.css( "#zoom option[selected='selected']" ) ).getText() ).to.eventually.equal( "100%" );
      } );

      it( "Should apply form as invalid due to URL Field empty entry", function() {
        expect( element( by.css( "form[name='settingsForm'].ng-invalid" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should disable Save button", function() {
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should not show warning message regarding X-Frame-Options feed", function() {
        expect( element( by.css( "#pageUrl + p.text-danger" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should not show warning message regarding invalid url", function() {
        expect( element( by.css( "#pageUrl p.text-danger" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should select 'Show Entire Page'", function() {
        expect( element( by.css( "input[type='radio'][value='page']" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should apply ''Never Refresh' for Refresh'", function( done ) {
        expect( element( by.model( "settings.additionalParams.refresh" ) ).getAttribute( "value" ) ).to.eventually.equal( 0 );
      } );

      it( "Should select 'Unload Web Page'", function() {
        expect( element( by.model( "settings.additionalParams.unload" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should select 'Enable cache buster'", function() {
        expect( element( by.model( "settings.additionalParams.cacheBuster" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should not select 'Allow Interaction'", function() {
        expect( element( by.model( "settings.additionalParams.interactivity.interactive" ) ).isSelected() ).to.eventually.be.false;
      } );

      it( "Should now show or select 'Scrollbars Enabled'", function() {
        expect( element( by.css( "input[name='scrollbars']" ) ).isDisplayed() ).to.eventually.be.false;
        expect( element( by.model( "settings.additionalParams.interactivity.scrollbars" ) ).isSelected() ).to.eventually.be.false;
      } );

    } );

    describe( "Visibility", function() {
      it( "Should not show 'Enable cache buster' if no refresh interval is selected", function() {
        expect( element( by.model( "settings.additionalParams.cacheBuster" ) ).isDisplayed() ).to.eventually.be.false;
      } );

      it( "Should show 'Enable cache buster' if a refresh interval is selected", function() {
        element( by.css( "select[name='refresh']" ) ).click();
        element( by.css( "select[name='refresh'] option[value='60000']" ) ).click();

        expect( element( by.model( "settings.additionalParams.cacheBuster" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should not show 'Enable cache buster' if 'Never Refresh' is selected", function() {
        element( by.css( "select[name='refresh']" ) ).click();
        element( by.css( "select[name='refresh'] option[value='0']" ) ).click();

        expect( element( by.model( "settings.additionalParams.cacheBuster" ) ).isDisplayed() ).to.eventually.be.false;
      } );

      it( "Should not show scroll settings if 'Show Entire Page' is selected", function() {
        expect( element( by.model( "settings.additionalParams.region.horizontal" ) ).isDisplayed() ).to.eventually.be.false;
        expect( element( by.model( "settings.additionalParams.region.vertical" ) ).isDisplayed() ).to.eventually.be.false;
      } );

      it( "Should show scroll settings if 'Show a Region' is selected", function() {
        element( by.css( "input[type='radio'][value='region']" ) ).click();

        expect( element( by.model( "settings.additionalParams.region.horizontal" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.model( "settings.additionalParams.region.vertical" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should show 'Scrollbars Enabled' when 'Allow Interaction' is selected", function() {
        element( by.css( "input[name='interactive']" ) ).click();

        expect( element( by.css( "input[name='scrollbars']" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should not show 'Scrollbars Enabled' and ensure value is false when 'Allow Interaction' deselected", function() {
        // 'Allow Interaction' is selected
        element( by.css( "input[name='interactive']" ) ).click();
        expect( element( by.model( "settings.additionalParams.interactivity.interactive" ) ).isSelected() ).to.eventually.be.true;

        // select 'Scrollbars Enabled'
        element( by.css( "input[name='scrollbars']" ) ).click();
        expect( element( by.model( "settings.additionalParams.interactivity.scrollbars" ) ).isSelected() ).to.eventually.be.true;

        // deselect 'Allow Interaction'
        element( by.css( "input[name='interactive']" ) ).click();

        expect( element( by.css( "input[name='scrollbars']" ) ).isDisplayed() ).to.eventually.be.false;
        expect( element( by.model( "settings.additionalParams.interactivity.scrollbars" ) ).isSelected() ).to.eventually.be.false;
      } );

      it( "Should disable 'Scrollbars Enabled' and ensure value is false  if Zoom selection is > 100%", function() {
        element( by.css( "select[name='zoom']" ) ).click();
        element( by.css( "select[name='zoom'] option[value='1.25']" ) ).click();

        expect( element( by.css( "input[name='scrollbars'][disabled='disabled']" ) ).isPresent() ).to.eventually.be.true;
        expect( element( by.model( "settings.additionalParams.interactivity.scrollbars" ) ).isSelected() ).to.eventually.be.false;
      } );

      it( "Should enable 'Scrollbars Enabled' if Zoom selection is <= 100%", function() {
        element( by.css( "select[name='zoom']" ) ).click();
        element( by.css( "select[name='zoom'] option[value='0.75']" ) ).click();

        expect( element( by.css( "input[name='scrollbars'][disabled='disabled']" ) ).isPresent() ).to.eventually.be.false;
      } );

    } );

    describe( "X-Frame-Options warning message", function() {
      it( "should not show warning when URL Field is receiving input", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( "http://test" );

        expect( element( by.css( "#pageUrl + p.text-danger" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "should show warning message when a webpage with X-Frame-Options header is present and does not use ALLOW FROM", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( "http://www.google.com" );
        // remove focus
        element( by.css( "h3.modal-title" ) ).click();

        expect( element( by.css( "#pageUrl + p.text-danger" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "should not show warning message when a webpage doesn't specify X-Frame-Options header", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( "http://www.risevision.com" );
        // remove focus
        element( by.css( "h3.modal-title" ) ).click();

        expect( element( by.css( "#pageUrl + p.text-danger" ) ).isPresent() ).to.eventually.be.false;
      } );
    } );

    describe( "frame-ancestors warning message", function() {
      it( "should show warning message when a webpage with content-security-policy header is present and restricts by frame-ancestors", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( "https://www.fireeye.com/cyber-map/threat-map.html" );
        // remove focus
        element( by.css( "h3.modal-title" ) ).click();

        expect( element( by.css( "#pageUrl + p.text-danger" ) ).isPresent() ).to.eventually.be.true;
      } );
    } );

    describe( "Saving", function() {

      it( "Should enable Save button due to valid URL entry", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( validUrl );

        // save button should be enabled
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.false;

        // form should be valid due to URL Field empty entry
        expect( element( by.css( "form[name='settingsForm'].ng-invalid" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should be invalid form and Save button disabled due to invalid URL", function() {
        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( invalidUrl );

        // save button should be disabled
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.true;

        // form should be invalid due to invalid URL
        expect( element( by.css( "form[name='settingsForm'].ng-invalid" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should be able to set the zoom to 50%", function() {
        element( by.cssContainingText( "option", "50%" ) ).click();

        expect( element( by.model( "settings.additionalParams.zoom" ) ).getAttribute( "value" ) ).to.eventually.equal( "0.50" );
      } );

      it( "Should correctly save settings", function() {
        var settings = {
          params: {},
          additionalParams: {
            cacheBuster: true,
            interactivity: {
              interactive: false,
              scrollbars: false
            },
            refresh: 0,
            region: {
              showRegion: "page",
              horizontal: 0,
              vertical: 0
            },
            unload: true,
            url: validUrl,
            zoom: 1
          }
        };

        element( by.css( "#pageUrl input[name='url']" ) ).sendKeys( validUrl );

        element( by.id( "save" ) ).click();

        expect( browser.executeScript( "return window.result" ) ).to.eventually.deep.equal(
          {
            "additionalParams": JSON.stringify( settings.additionalParams ),
            "params": ""
          } );
      } );
    } );

  } );

} )();
