angular.module("risevision.widget.web-page.settings")
  .controller("webPageSettingsController", ["$scope", "$log", "xframeOptions",
    function ($scope, $log, xframeOptions) {

      $scope.noXFrameOptions = true;

      $scope.validateXFrame = function() {
        xframeOptions.hasOptions($scope.settings.additionalParams.url).then(function(value){
          $scope.noXFrameOptions = !value;
        });
      };

      $scope.$on("urlFieldBlur", function () {
        if ($scope.settingsForm.pageUrl.$valid) {
          $scope.validateXFrame();
        }
      });

      $scope.$watch("settings.additionalParams.url", function (newVal, oldVal) {
        if (typeof oldVal === "undefined" && newVal && newVal !== "") {
          // previously saved settings are being shown, ensure to check if page has X-Frame-Options
          if ($scope.settingsForm.pageUrl.$valid) {
            $scope.validateXFrame();
          }
        }
        else {
          if (typeof newVal !== "undefined") {
            // ensure warning message doesn't get shown while url field is receiving input
            $scope.noXFrameOptions = true;
          }
        }

      });

      $scope.$watch("settings.additionalParams.zoom", function (value) {
        if (typeof value !== "undefined") {
          if (value > 1) {
            $scope.settings.additionalParams.interactivity.scrollbars = false;
          }
        }
      });

      $scope.$watch("settings.additionalParams.interactivity.interactive", function (value) {
        if (typeof value !== "undefined") {
          if (!value) {
            $scope.settings.additionalParams.interactivity.scrollbars = false;
          }
        }
      });

    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
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
      url: "",
      zoom: 1
    }
  });
