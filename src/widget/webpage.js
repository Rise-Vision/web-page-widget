/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage = (function (document, gadgets) {

  "use strict";

  // private variables
  var _prefs = new gadgets.Prefs(),
    _additionalParams = null,
    _url = "";

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
        success = false;
        _message.show("Please note that the X-Frame-Options header has been detected in the request response for the web page provided and will prevent the web page from appearing.");
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

      // implement responsive iframe
      container.setAttribute("style", "padding-bottom:" + aspectRatio + "%");
    }
  }

  function _loadFrame() {
    var frame = document.getElementById("webpage-frame"),
      container = document.getElementById("container");

    if (container && frame) {
      frame.onload = function () {
        frame.onload = null;

        // Show the iframe container
        container.style.visibility = "visible";
      };

      frame.setAttribute("src", _url);
    }
  }

  function _unloadFrame() {
    var frame = document.getElementById("webpage-frame");

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
