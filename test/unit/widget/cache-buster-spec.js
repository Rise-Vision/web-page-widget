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

  it( "should append a cache buster parameter to an URL with no query string and hash", function() {
    var url = "http://localhost:8080/#anchor",
      regex = /http:[/][/]localhost:8080[/][?]__cachebuster__=\d+#anchor/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

  it( "should append a cache buster parameter to an URL that already has a query string and hash", function() {
    var url = "http://localhost:8080/?param=1&param=2#anchor",
      regex = /http:[/][/]localhost:8080[/][?]param=1&param=2&__cachebuster__=\d+#anchor/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

  it( "should append a cache buster parameter to an URL that has a hash with extra # characters", function() {
    var url = "http://localhost:8080/?param=1&param=2#anchor#other#",
      regex = /http:[/][/]localhost:8080[/][?]param=1&param=2&__cachebuster__=\d+#anchor#other#/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

  it( "should append a cache buster parameter to an URL that has a hash with a false query string", function() {
    var url = "http://localhost:8080/#anchor?other=1",
      regex = /http:[/][/]localhost:8080[/][?]__cachebuster__=\d+#anchor[?]other=1/;

    expect( page.withCacheBusterAppended( url ) ).to.match( regex );
  } );

} );
