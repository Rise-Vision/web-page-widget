( function( window ) {
  "use strict";
  window.innerWidth = 600;
  window.innerHeight = 400;

  window.gadget = window.gadget || {};
  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      "interactivity": {
        "interactive": false,
        "scrollbars": false
      },
      "refresh": 0,
      "region": {
        "showRegion": "region",
        "horizontal": 10,
        "vertical": 20
      },
      "unload": true,
      "url": "http://www.risevision.com",
      "zoom": "0.75"
    }
  };
} )( window );
