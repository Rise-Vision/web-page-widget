/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage = (function (document, gadgets) {

  "use strict";

  // private variables
  var _prefs = null,
    _additionalParams = {},
    _url = "",
    _intervalId = null;

  function _configurePage() {
    var container = document.getElementById("webpage-container"),
      frame = document.getElementById("webpage-frame"),
      aspectRatio =  (_prefs.getInt("rsH") / _prefs.getInt("rsW")) * 100,
      scrollHorizVal = (_additionalParams.scrollHorizontal > 0) ?
          _additionalParams.scrollHorizontal : 0,
      scrollVertVal = (_additionalParams.scrollVertical > 0) ?
          _additionalParams.scrollVertical : 0,
      zoom = parseFloat(_additionalParams.zoom),
      blocker, zoomStyle, marginStyle;

    if (container && frame) {
      blocker = container.getElementsByClassName("blocker")[0];

      // Hiding iframe container, visible when the iframe successfully loads
      container.style.visibility = "hidden";

      // set the padding-bottom with the aspect ratio % (responsive)
      if (scrollVertVal !== 0) {
        // recalculate aspect ratio
        aspectRatio += (scrollVertVal / _prefs.getInt("rsW")) * 100;
      }
      container.setAttribute("style", "padding-bottom:" + aspectRatio + "%");

      // Configure interactivity of iframe
      blocker.style.display = (_additionalParams.interactive) ? "none" : "block";
      frame.setAttribute("scrolling",
        (_additionalParams.scrollbars) ? "yes" : "no");

      // Configure the zoom (scale) styling
      zoomStyle = "-ms-zoom:" + zoom + ";" +
        "-moz-transform: scale(" + zoom + ");" +
        "-moz-transform-origin: 0 0;" +
        "-o-transform: scale(" + zoom + ");" +
        "-o-transform-origin: 0 0;" +
        "-webkit-transform: scale(" + zoom + ");" +
        "-webkit-transform-origin: 0 0;";

      // Apply the zoom (scale) on the iframe
      frame.setAttribute("style", zoomStyle);

      if (scrollHorizVal !== 0 || scrollVertVal !== 0) {
        // Configure the margin styling
        marginStyle = "margin: " + "-" + scrollVertVal + "px 0 0 -" +
          scrollHorizVal + "px;";

        /* Apply the margin styling on the iframe while maintaining
         the zoom styling */
        frame.setAttribute("style", zoomStyle + marginStyle);
      }
    }
  }

  function _loadFrame() {
    var frame = document.getElementById("webpage-frame"),
      container = document.getElementById("webpage-container"),
      hasParams = /[?#&]/.test(_url),
      randomNum = Math.ceil(Math.random() * 100),
      refreshURL = hasParams ?
          _url + "&dummyVar=" + randomNum :
          _url + "?dummyVar=" + randomNum;

    if (container && frame) {
      frame.onload = function () {
        frame.onload = null;

        // Show the iframe container
        container.style.visibility = "visible";

        // Run setInterval to reload page based on the data refresh value
        if (_additionalParams.refresh > 0 && _intervalId === null) {
          _intervalId = setInterval(function () {
            _loadFrame();
          }, _additionalParams.refresh);
        }
      };

      frame.setAttribute("src", refreshURL);
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

  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"),
      true, true, true, true, false);
  }

  function pause() {
    _unloadFrame();
  }

  function play() {
    _loadFrame();
  }

  function stop() {
    _unloadFrame();
  }

  function setParams(names, values) {
    _prefs = new gadgets.Prefs();

    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        _additionalParams = JSON.parse(values[0]);

        // set the document background with value saved in settings
        document.body.style.background = _additionalParams.background.color;

        // Configure the value for _url
        _url = _additionalParams.url;

        // Add http:// if no protocol parameter exists
        if (_url.indexOf("://") === -1) {
          _url = "http://" + _url;
        }

        _configurePage();
        _ready();
      }
    }
  }

  return {
    setParams: setParams,
    pause: pause,
    play: play,
    stop: stop
  };

})(document, gadgets);
