/* global describe, it, expect, RiseVision */

/* eslint-disable func-names */

"use strict";

describe( "withCacheBusterAppended()", function() {
  var page = RiseVision.WebPage;

  it( "should append a cache buster parameter to an URL with no query string", function() {
    var url = "http://localhost:8080/",
      regex = /http:[/][/]localhost:8080[/][?]__cachebuster__=\d+/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

  it( "should append a cache buster parameter to an URL that already has a query string", function() {
    var url = "http://localhost:8080/?param=1&param=2",
      regex = /http:[/][/]localhost:8080[/][?]param=1&param=2&__cachebuster__=\d+/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

} );
