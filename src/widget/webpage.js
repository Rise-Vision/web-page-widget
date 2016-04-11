/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage = (function (document, gadgets) {

  "use strict";

  // private variables
  var _prefs = new gadgets.Prefs(),
    _additionalParams = null,
    _url = "",
    _vertical = 0,
    _intervalId = null;

  var _message = null;

  /*
   *  Private Methods
   */
  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"),
      true, true, true, true, false);
  }

  function _validateUrl(cb) {
    var proxyUrl = "https://proxy.risevision.com/" + _url,
      request = new XMLHttpRequest();

    function handleProxyResponse(e) {
      var success = true,
        header = e.target.getResponseHeader("X-Frame-Options");

      if (header && (header.toUpperCase() === "SAMEORIGIN")) {
        logEvent({
          "event": "error",
          "event_details": "X-Frame-Options header",
          "error_details": "SAMEORIGIN",
          "url": _url
        });

        _message.show("The owner of the Web Page at the URL provided does not allow the Page to " +
          "be embedded within an iFrame. If possible, please contact the Web Page owner to " +
          "discuss X-Frame-Options.");

        success = false;
      }

      if (cb && (typeof cb === "function")) {
        cb(success);
      }
    }

    request.addEventListener("load", handleProxyResponse);
    request.open("GET", proxyUrl);
    request.send();
  }

  function _configurePage() {
    var container = document.getElementById("container"),
      frame = document.getElementById("webpage-frame"),
      aspectRatio =  (_prefs.getInt("rsH") / _prefs.getInt("rsW")) * 100;

    if (container && frame) {
      // Hiding iframe container, visible when the iframe successfully loads
      container.style.visibility = "hidden";

      _setRegion(frame);

      // implement responsive iframe
      if (_vertical !== 0) {
        aspectRatio += (_vertical / _prefs.getInt("rsW")) * 100;
      }

      container.setAttribute("style", "padding-bottom:" + aspectRatio + "%");
    }
  }

  function _setRegion(frame) {
    var marginStyle = "",
      horizontal = 0;

    if (_additionalParams.region && _additionalParams.region.showRegion &&
      (_additionalParams.region.showRegion === "region")) {
      if (_additionalParams.region.horizontal > 0) {
        horizontal = _additionalParams.region.horizontal;
      }

      if (_additionalParams.region.vertical > 0) {
        _vertical = _additionalParams.region.vertical;
      }

      // Apply negative margins in order to show a region.
      if ((horizontal !== 0) || (_vertical !== 0)) {
        marginStyle = "margin: " + "-" + _vertical + "px 0 0 -" + horizontal + "px;";
        frame.setAttribute("style", marginStyle);
      }
    }
  }

  function _startRefreshInterval() {
    _intervalId = setInterval(function () {
      // call public function for integration testing purposes
      _loadFrame();
    }, _additionalParams.refresh);
  }

  function _loadFrame() {
    var frame = document.getElementById("webpage-frame"),
      container = document.getElementById("container");

    if (container && frame) {
      frame.onload = function () {
        frame.onload = null;

        // Show the iframe container
        container.style.visibility = "visible";

        // check if refresh interval should be started
        if (_additionalParams.refresh > 0 && _intervalId === null) {
          _startRefreshInterval();
        }
      };

      frame.setAttribute("src", _url);
    }
  }

  function _unloadFrame() {
    var frame = document.getElementById("webpage-frame");

    if (_additionalParams.refresh > 0) {
      clearInterval(_intervalId);
    }

    if (frame) {
      frame.src = "about:blank";
    }

  }

  function _init() {
    _message = new RiseVision.Common.Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    // Configure the value for _url
    _url = _additionalParams.url;

    // Add http:// if no protocol parameter exists
    if (_url.indexOf("://") === -1) {
      _url = "http://" + _url;
    }

    _validateUrl(function(success) {
      if (success) {
        _configurePage();
      }

      _ready();
    });
  }

  /*
   *  Public Methods
   */
  function getTableName() {
    return "webpage_events";
  }

  function logEvent(params) {
    RiseVision.Common.LoggerUtils.logEvent(getTableName(), params);
  }

  function pause() {
    _unloadFrame();
  }

  function play() {
    _loadFrame();
  }

  function stop() {
    pause();
  }

  function setAdditionalParams(additionalParams) {
    _additionalParams = JSON.parse(JSON.stringify(additionalParams));

    _init();
  }

  return {
    "getTableName": getTableName,
    "logEvent": logEvent,
    "setAdditionalParams": setAdditionalParams,
    "pause": pause,
    "play": play,
    "stop": stop
  };

})(document, gadgets);
