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

    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      url: "",
      region: {
        showRegion: "page",
        horizontal: 0,
        vertical: 0
      },
      zoom: 1
    }
  });
