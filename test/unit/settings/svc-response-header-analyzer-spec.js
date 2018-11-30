/* global describe, beforeEach, it, expect, module, inject */

/* eslint-disable func-names */

"use strict";

describe( "Response Header Analyzer", function() {
  var $httpBackend,
    responseHeaderAnalyzer;

  beforeEach( module( "risevision.widget.web-page.settings" ) );

  beforeEach( inject( function( $injector ) {
    $httpBackend = $injector.get( "$httpBackend" );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.google.com" )
      .respond( 200, "", { "x-frame-options": "SAMEORIGIN" } );

    $httpBackend.when( "GET", "https://proxy.risevision.com/http://www.risevision.com" )
      .respond( 200, "", {} );

    $httpBackend.when( "GET", "https://proxy.risevision.com/https://www.fireeye.com" )
      .respond( 200, "", {
        "content-security-policy": "default-src https: data: 'unsafe-inline' 'unsafe-eval';frame-ancestors 'self' https://content.fireeye.com"
      } );

    $httpBackend.when( "GET", "https://proxy.risevision.com/https://www.fireeye.com" )
      .respond( 200, "", {
        "content-security-policy": "default-src https: data: 'unsafe-inline' 'unsafe-eval';frame-ancestors 'self' https://content.fireeye.com"
      } );
  } ) );


  beforeEach( inject( function( _responseHeaderAnalyzer_ ) {
    responseHeaderAnalyzer = _responseHeaderAnalyzer_;
  } ) );

  describe( "responseHeaderAnalyzer", function() {
    it( "should exist", function() {
      expect( responseHeaderAnalyzer ).to.be.defined;
    } );
  } );

  describe( "getOptions", function() {
    it( "should exist", function() {
      expect( responseHeaderAnalyzer.getOptions ).be.defined;
      expect( responseHeaderAnalyzer.getOptions ).to.be.a( "function" );
    } );

    it( "should return 'X-Frame-Options' when X-Frame-Options header is present in response of webpage request", function( done ) {
      responseHeaderAnalyzer.getOptions( "http://www.google.com" )
      .then( function( options ) {
        expect( options ).to.deep.equal( [ "X-Frame-Options" ] );
        done();
      } );

      $httpBackend.flush();
    } );

    it( "should return empty options when X-Frame-Options header is not present in response of webpage request", function( done ) {
      responseHeaderAnalyzer.getOptions( "http://www.risevision.com" )
      .then( function( options ) {
        expect( options ).to.deep.equal( [] );
        done();
      } );

      $httpBackend.flush();

    } );

    it( "should return 'frame-ancestors' when content-security-policy header is present and restricts by frame-ancestors", function( done ) {
      responseHeaderAnalyzer.getOptions( "https://www.fireeye.com" )
      .then( function( options ) {
        expect( options ).to.deep.equal( [ "frame-ancestors" ] );
        done();
      } );

      $httpBackend.flush();
    } );

  } );

} );
