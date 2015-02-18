angular.module("risevision.widget.web-page.settings")
  .controller("webPageSettingsController", ["$scope", "$log", "commonSettings",
    function ($scope, $log, commonSettings) {

      $scope.$watch("settings.additionalParams.interactive", function (interactive) {
        if (typeof interactive !== "undefined") {
          if (!interactive) {
            $scope.settings.additionalParams.scrollbars = false;
          }
        }
      });

      $scope.$watch("settings.additionalParams.zoom", function (zoom) {
        if (typeof zoom !== "undefined") {
          if (zoom > 1) {
            $scope.settings.additionalParams.scrollbars = false;
          }
        }
      });

      $scope.$watch("settings.additionalParams.background.image.url", function (url) {
        if (typeof url !== "undefined" && url !== "") {
          if ($scope.settingsForm.background.$valid ) {
            $scope.settings.additionalParams.backgroundStorage = commonSettings.getStorageUrlData(url);
          } else {
            $scope.settings.additionalParams.backgroundStorage = {};
          }
        }
      });

    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      url: "",
      scrollHorizontal: 0,
      scrollVertical: 0,
      zoom: 1,
      interactive: true,
      scrollbars: true,
      refresh: 0,
      background: {},
      backgroundStorage: {}
    }
  });
