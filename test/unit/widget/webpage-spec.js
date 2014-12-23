"use strict";

describe("Web Page Widget - RiseVision.WebPage", function() {
  it("should exist", function() {
    expect(RiseVision.WebPage).to.exist;
    expect(RiseVision.WebPage).to.be.an("object");
    expect(RiseVision.WebPage.setParams).to.be.a("function");
    expect(RiseVision.WebPage.pause).to.be.a("function");
    expect(RiseVision.WebPage.play).to.be.a("function");
    expect(RiseVision.WebPage.stop).to.be.a("function");

  });
});
