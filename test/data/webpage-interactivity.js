( function( window ) {
  "use strict";
  window.innerWidth = 600;
  window.innerHeight = 400;

  window.gadget = window.gadget || {};
  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      "interactivity": {
        "interactive": true,
        "scrollbars": true
      },
      "refresh": 0,
      "region": {
        "showRegion": "page",
        "horizontal": 0,
        "vertical": 0
      },
      "unload": true,
      "url": "http://www.risevision.com"
    }
  };
} )( window );
