angular.module("risevision.widget.web-page.settings")
  .controller("webPageSettingsController", ["$scope", "$log",
    function ($scope/*, $log*/) {

      // Using this to apply an initial one time error message regarding url being required
      $scope.initialView = true;

      var urlWatcher = $scope.$watch("settings.additionalParams.url", function (newUrl, oldUrl) {
        if (typeof newUrl !== "undefined") {
          if (typeof oldUrl === "undefined" && newUrl === "") {
            /* Settings have never been saved (initial save state), need to force validity on form to be false
            because the URL Field component deliberately does not initially trigger an invalid state
             */
            $scope.settingsForm.$setValidity("urlEntry", false);
          } else if (newUrl !== "") {
            // entry has occurred
            $scope.initialView = false;
            $scope.settingsForm.$setValidity("urlEntry", true);

            // destroy watcher
            urlWatcher();
          }
        }
      });

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
      background: {}
    }
  });
