/* global describe, beforeEach, it, expect, module, inject */

/* eslint-disable func-names */

"use strict";

describe( "X-Frame Options", function() {
  var $httpBackend,
    xframeOptions;

  beforeEach( module( "risevision.widget.web-page.settings" ) );

  beforeEach( inject( function( $injector ) {
    $httpBackend = $injector.get( "$httpBackend" );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.google.com" )
      .respond( 200, "", { "x-frame-options": "SAMEORIGIN" } );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.risevision.com" )
      .respond( 200, "", {} );
  } ) );


  beforeEach( inject( function( _xframeOptions_ ) {
    xframeOptions = _xframeOptions_;
  } ) );

  describe( "xframeOptions", function() {
    it( "should exist", function() {
      expect( xframeOptions ).to.be.defined;
    } );
  } );

  describe( "hasOptions", function() {
    it( "should exist", function() {
      expect( xframeOptions.hasOptions ).be.defined;
      expect( xframeOptions.hasOptions ).to.be.a( "function" );
    } );

    it( "should return true when X-Frame-Options header is present in response of webpage request", function( done ) {
      xframeOptions.hasOptions( "http://www.google.com" ).then( function( value ) {
        expect( value ).to.be.true;
        done();
      } );

      $httpBackend.flush();
    } );

    it( "should return false when X-Frame-Options header is not present in response of webpage request", function( done ) {
      xframeOptions.hasOptions( "http://www.risevision.com" ).then( function( value ) {
        expect( value ).to.be.false;
        done();
      } );

      $httpBackend.flush();

    } );

  } );

} );
