/* global describe, it, expect, RiseVision */

/* eslint-disable func-names */

"use strict";

describe( "withCacheBusterAppended()", function() {
  var page = RiseVision.WebPage;

  it( "should append a cache buster parameter to an URL with no query string", function() {
    var url = "http://localhost:8080/";

    expect( page.withCacheBusterAppended( url ) ).to.match( /http:[/][/]localhost:8080[/]/ );
  } );

} );
