(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      url: "http://www.risevision.com",
      scrollHorizontal: 0,
      scrollVertical: 0,
      zoom: "1",
      interactive: true,
      scrollbars: true,
      refresh: 0,
      "background": {
        "color": "rgba(145,145,145,0)",
        "useImage": true,
        "image": {
          "url": "http://s3.amazonaws.com/rise-common/images/logo-small.png",
          "position": "middle-center",
          "scale": true
        }
      },
      "backgroundStorage": {}
    }
  };

})(window);
