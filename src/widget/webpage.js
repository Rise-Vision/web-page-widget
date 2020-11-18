/* global gadgets */

var RiseVision = RiseVision || {};

RiseVision.WebPage = {};

RiseVision.WebPage = ( function( document, gadgets ) {

  "use strict";

  // private variables
  var _prefs = new gadgets.Prefs(),
    _utils = RiseVision.Common.Utilities,
    _additionalParams = null,
    _url = "",
    _vertical = 0,
    _intervalId = null,
    _initialLoad = true,
    _widthOffset = 0,
    _message = null; // eslint-disable-line no-unused-vars

  /*
   *  Private Methods
   */
  function _ready() {
    gadgets.rpc.call( "", "rsevent_ready", null, _prefs.getString( "id" ),
      true, true, true, true, false );
  }

  function _logConfiguration() {
    logEvent( {
      event: "configuration",
      event_details: JSON.stringify( _additionalParams ),
      url: _url
    } )
  }

  function _setInteractivity( frame ) {
    var blocker = document.querySelector( ".blocker" );

    blocker.style.display = ( _additionalParams.interactivity.interactive ) ? "none" : "block";

    frame.setAttribute( "scrolling",
      ( _additionalParams.interactivity.interactive && _additionalParams.interactivity.scrollbars ) ? "yes" : "no" );
  }

  function _setAspectRatio() {
    var container = document.getElementById( "container" ),
      aspectRatio = ( _prefs.getInt( "rsH" ) / _prefs.getInt( "rsW" ) ) * 100;

    if ( container ) {
      // implement responsive iframe
      if ( _vertical !== 0 ) {
        aspectRatio += ( _vertical / _prefs.getInt( "rsW" ) ) * 100;
      }

      container.setAttribute( "style", "padding-bottom:" + aspectRatio + "%" );
    }
  }

  function _setZoom( frame ) {
    var zoom = parseFloat( _additionalParams.zoom ),
      currentStyle = "",
      zoomStyle = "";

    // Configure the zoom (scale) styling
    zoomStyle = "-ms-zoom:" + zoom + ";" +
      "-moz-transform: scale(" + zoom + ");" +
      "-moz-transform-origin: 0 0;" +
      "-o-transform: scale(" + zoom + ");" +
      "-o-transform-origin: 0 0;" +
      "-webkit-transform: scale(" + zoom + ");" +
      "-webkit-transform-origin: 0 0;" +
      "transform: scale(" + zoom + ");" +
      "transform-origin: 0 0;";

    currentStyle = frame.getAttribute( "style" );
    zoomStyle += "width: " + ( ( ( 1 / zoom ) * 100 ) + _widthOffset ) + "%;" +
      "height: " + ( ( 1 / zoom ) * 100 ) + "%;";

    if ( currentStyle ) {
      zoomStyle = currentStyle + zoomStyle;
    }

    frame.setAttribute( "style", zoomStyle );
  }

  function _setRegion( frame ) {
    var currentStyle = "",
      marginStyle = "",
      horizontal = 0;

    if ( _additionalParams.region && _additionalParams.region.showRegion &&
      ( _additionalParams.region.showRegion === "region" ) ) {
      if ( _additionalParams.region.horizontal > 0 ) {
        horizontal = _additionalParams.region.horizontal;
      }

      if ( _additionalParams.region.vertical > 0 ) {
        _vertical = _additionalParams.region.vertical;
      }

      // Apply negative margins in order to show a region.
      if ( ( horizontal !== 0 ) || ( _vertical !== 0 ) ) {
        // Calculate the width offset when region is chosen.
        _widthOffset = ( horizontal * 100 ) / _prefs.getInt( "rsW" );

        currentStyle = frame.getAttribute( "style" );
        marginStyle = "margin: " + "-" + _vertical + "px 0 0 -" + horizontal + "px;";

        if ( currentStyle ) {
          marginStyle = currentStyle + marginStyle;
        }

        frame.setAttribute( "style", marginStyle );
      }
    }
  }

  function _startRefreshInterval() {
    _intervalId = setInterval( function() {
      _utils.hasInternetConnection( "img/transparent.png", function( hasInternet ) {
        if ( hasInternet ) {
          _loadFrame( true );
        }
      } );
    }, _additionalParams.refresh );
  }

  function _getFrameElement() {
    var frame = document.createElement( "iframe" ),
      container = document.getElementById( "container" );

    frame.className = "webpage-frame";
    frame.style.visibility = "hidden";
    frame.setAttribute( "frameborder", "0" );
    frame.setAttribute( "allowTransparency", "true" );
    frame.setAttribute( "allow", "fullscreen" );
    frame.setAttribute( "allowfullscreen", true );
    frame.setAttribute( "sandbox", "allow-forms allow-same-origin allow-scripts" );

    _setInteractivity( frame );
    _setRegion( frame );
    _setZoom( frame );
    _setAspectRatio();

    frame.onload = function() {
      this.onload = null;
      this.style.visibility = "visible";

      _initialLoad = false;

      // check if refresh interval should be started
      if ( _additionalParams.refresh > 0 && _intervalId === null ) {
        _startRefreshInterval();
      }

      if ( document.querySelectorAll( ".webpage-frame" ).length > 1 ) {
        // Refresh occurred, remove old iframe
        container.removeChild( document.querySelector( ".webpage-frame" ) );
      }
    };

    return frame;
  }

  function _shouldUseCacheBuster( isRefresh ) {
    var useCacheBuster = !_additionalParams.hasOwnProperty( "cacheBuster" ) ||
      _additionalParams.cacheBuster;

    return isRefresh && useCacheBuster;
  }

  function _loadFrame( isRefresh ) {
    var container = document.getElementById( "container" ),
      fragment = document.createDocumentFragment(),
      frame = _getFrameElement(),
      refreshUrl = _shouldUseCacheBuster( isRefresh ) ?
        withCacheBuster( _url ) : _url;

    frame.setAttribute( "src", refreshUrl );

    fragment.appendChild( frame );
    container.appendChild( fragment );
  }

  function _unloadFrame() {
    var container = document.getElementById( "container" ),
      frame = document.querySelector( ".webpage-frame" );

    if ( _additionalParams.refresh > 0 ) {
      clearInterval( _intervalId );
      _intervalId = null;
    }

    if ( frame ) {
      container.removeChild( frame );
    }

  }

  function _init() {
    _message = new RiseVision.Common.Message( document.getElementById( "container" ),
      document.getElementById( "messageContainer" ) );

    // apply height value to message container so a message gets vertically centered
    document.getElementById( "messageContainer" ).style.height = _prefs.getInt( "rsH" ) + "px";

    // Configure the value for _url
    _url = _additionalParams.url;

    // Add https:// if no protocol parameter exists
    if ( _url.indexOf( "://" ) === -1 ) {
      _url = "https://" + _url;
    }

    _logConfiguration();
    _ready();
  }

  /*
   *  Public Methods
   */
  function getTableName() {
    return "webpage_events";
  }

  function logEvent( params ) {
    RiseVision.Common.LoggerUtils.logEvent( getTableName(), params );
  }

  function pause() {
    if ( _additionalParams.unload ) {
      _unloadFrame();
    }
  }

  function play() {
    if ( _initialLoad || _additionalParams.unload ) {
      _loadFrame( false );
    }
  }

  function stop() {
    pause();
  }

  function setAdditionalParams( additionalParams ) {
    _additionalParams = JSON.parse( JSON.stringify( additionalParams ) );

    _init();
  }

  function withCacheBuster( url ) {
    var hashIndex = url.indexOf( "#" ),
      fragments = hashIndex < 0 ? [ url, "" ] : [
        url.substring( 0, hashIndex ), url.substring( hashIndex )
      ],
      separator = /[?&]/.test( fragments[ 0 ] ) ? "&" : "?",
      timestamp = ( new Date() ).getTime();

    return fragments[ 0 ] + separator + "__cachebuster__=" + timestamp + fragments[ 1 ];
  }

  return {
    "getTableName": getTableName,
    "logEvent": logEvent,
    "setAdditionalParams": setAdditionalParams,
    "pause": pause,
    "play": play,
    "stop": stop,
    "withCacheBuster": withCacheBuster
  };

} )( document, gadgets );
