/*jshint expr:true */
"use strict";

describe("Web Page Settings", function () {

  var defaultSettings, $scope;

  beforeEach(module("risevision.widget.web-page.settings"));

  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      defaultSettings = $injector.get("defaultSettings");
      $scope = $rootScope.$new();
      $controller("webPageSettingsController", {$scope: $scope});
    });
  });

  it("should define defaultSettings", function (){
    expect(defaultSettings).to.be.truely;
    expect(defaultSettings).to.be.an("object");
  });

  it("should define webPageSettingsController", function (){
    expect($scope.initialView).to.be.truely;
  });

});
