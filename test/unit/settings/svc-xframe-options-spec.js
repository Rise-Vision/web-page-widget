/* global describe, beforeEach, it, expect, module, inject */

/* eslint-disable func-names */

"use strict";

describe( "X-Frame Options", function() {
  var $httpBackend,
    responseHeaderAnalyzer;

  beforeEach( module( "risevision.widget.web-page.settings" ) );

  beforeEach( inject( function( $injector ) {
    $httpBackend = $injector.get( "$httpBackend" );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.google.com" )
      .respond( 200, "", { "x-frame-options": "SAMEORIGIN" } );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.risevision.com" )
      .respond( 200, "", {} );
  } ) );


  beforeEach( inject( function( _responseHeaderAnalyzer_ ) {
    responseHeaderAnalyzer = _responseHeaderAnalyzer_;
  } ) );

  describe( "responseHeaderAnalyzer", function() {
    it( "should exist", function() {
      expect( responseHeaderAnalyzer ).to.be.defined;
    } );
  } );

  describe( "hasOptions", function() {
    it( "should exist", function() {
      expect( responseHeaderAnalyzer.hasOptions ).be.defined;
      expect( responseHeaderAnalyzer.hasOptions ).to.be.a( "function" );
    } );

    it( "should return true when X-Frame-Options header is present in response of webpage request", function( done ) {
      responseHeaderAnalyzer.hasOptions( "http://www.google.com" ).then( function( value ) {
        expect( value ).to.be.true;
        done();
      } );

      $httpBackend.flush();
    } );

    it( "should return false when X-Frame-Options header is not present in response of webpage request", function( done ) {
      responseHeaderAnalyzer.hasOptions( "http://www.risevision.com" ).then( function( value ) {
        expect( value ).to.be.false;
        done();
      } );

      $httpBackend.flush();

    } );

  } );

} );
