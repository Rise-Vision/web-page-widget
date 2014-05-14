var RiseVision = RiseVision || {};
RiseVision.WebPage = {};

RiseVision.WebPage.Settings = (function($,gadgets, i18n) {
  "use strict";

  // private variables
  var _prefs = null;

  // private functions
  function _bind(){
    // Add event handlers
    $("#save").on("click", function() {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function() {
      window.open("http://www.risevision.com/help/users/what-are-gadgets/" +
        "free-gadgets/rise-vision-url/", "_blank");
    });

    $("#interactive").on("click", function(event) {
      if ($(this).is(":checked")) {
        $("#interactivity > div + div.checkbox").show();
      } else {
        if ($("#scrollbars").is(":checked")) {
          $("#scrollbars").click();
        }
        $("#interactivity > div + div.checkbox").hide();
      }
    });
  }

  function _getAdditionalParams(){
    var additionalParams = {};

    additionalParams["url"] = $("#url").val();

    return additionalParams;
  }

  function _getParams(){
    var params = "&up_scroll-horizontal=" +
      $.trim($("#scroll-horizontal").val()) + "&up_scroll-vertical=" +
      $.trim($("#scroll-vertical").val()) + "&up_zoom=" +
      $("#zoom").val() + "&up_interactive=" +
      $("#interactive").is(":checked").toString() + "&up_scrollbars=" +
      $("#scrollbars").is(":checked").toString() + "&up_data-refresh=" +
      $("#refresh").val();

    return params;
  }

  function _saveSettings(){
    var settings = null;

    // validate
    if(!_validate()){
      $("#settings-alert").show();
      $(".widget-wrapper").scrollTop(0);
    } else {
      //construct settings object
      settings = {
        "params" : _getParams(),
        "additionalParams" : JSON.stringify(_getAdditionalParams())
      }

      gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
    }
  }

  function _validate(){
    var alerts = document.getElementById("settings-alert");

    $("#settings-alert").empty().hide();

    if(!_validateRequired($("#url"), alerts, "URL")){ return false; }
    if(!_validateURL($("#url"), alerts, "URL")){ return false; }
    if(!_validateRequired($("#scroll-horizontal"), alerts,
      "Horizontal Scroll")){ return false; }
    if(!_validateIsNumber($("#scroll-horizontal"), alerts,
      "Horizontal Scroll")){ return false; }
    if(!_validateRequired($("#scroll-vertical"), alerts,
      "Vertical Scroll")){ return false; }
    if(!_validateIsNumber($("#scroll-vertical"), alerts,
      "Vertical Scroll")){ return false; }
    if(!_validateScrollSizes(alerts)){ return false; }

    return true;
  }

  function _validateIsNumber($element, errors, fieldName){
    /*
     Stricter than parseInt, using regular expression as mentioned on mozilla
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
     Global_Objects/parseInt
     */
    var val = $.trim($element.val()),
        parseIntRegExp = /^(\-|\+)?([0-9]+|Infinity)$/;

    if (!$element.is(":visible")) {
      return true;
    } else {
      if (!parseIntRegExp.test(val)) {
        errors.innerHTML += fieldName + " must be a number.<br />";
        return false;
      }
    }

    return true;
  }

  function _validateRequired($element, errors, fieldName){
    //Don't validate element if it's hidden.
    if (!$element.is(":visible")) {
      return true;
    } else {
      if (!$.trim($element.val())) {
        errors.innerHTML += fieldName + " is a required field.<br />";
        return false;
      }
    }

    return true;
  }

  function _validateScrollSizes(errors){
    var scrollHorizVal = parseInt($.trim($("#scroll-horizontal").val())),
        scrollVertVal = parseInt($.trim($("#scroll-vertical").val()));

    if(scrollHorizVal >  parseInt(_prefs.getString("rsW"))){
      errors.innerHTML += "Horizontal Scroll value entered exceeds size of " +
        "placeholder.<br />";
      return false;
    }

    if(scrollVertVal > parseInt(_prefs.getString("rsH"))){
      errors.innerHTML += "Vertical Scroll value entered exceeds size of " +
        "placeholder.<br />";
      return false;
    }

    return true;
  }

  function _validateURL($element, errors, fieldName){
    /*
     Discussion
     http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
     with-links#21925491

     Using
     https://github.com/component/regexps/blob/master/index.js#L3

     */
    var urlRegExp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;

    //Don't validate element if it's hidden.
    if (!$element.is(":visible")) {
      return true;
    } else {
      if (!urlRegExp.test($.trim($element.val()))){
        errors.innerHTML += fieldName + " is invalid. Please enter a " +
          "valid URL.<br />";
        return false;
      }
    }

    return true;
  }

  // public space
  return {
    init: function(){

      _bind();

      $("#settings-alert").hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          $("#scroll-horizontal").val(_prefs.getString("scroll-horizontal"));
          $("#scroll-vertical").val(_prefs.getString("scroll-vertical"));
          $("#zoom").val(_prefs.getString("zoom"));
          $("#interactive").attr("checked", _prefs.getBool("interactive"));
          $("#scrollbars").attr("checked", _prefs.getBool("scrollbars"));
          $("#refresh").val(_prefs.getString("data-refresh"));

          //Additional params
          $("#url").val(result["url"]);

        } else {
          // initialize input elements with defaults
          $("#scroll-horizontal").val(0);
          $("#scroll-vertical").val(0);
        }

        /* Manually trigger event handlers so that the visibility of fields
           can be set. */
        $("#interactive").triggerHandler("click");

        i18n.init({ fallbackLng: "en" }, function(t) {
          $(".widget-wrapper").i18n().show();
          $(".form-control").selectpicker();

          // Set tooltips only after i18n has shown
          $("label[for='scroll-horizontal'] + button, " +
            "label[for='scroll-vertical'] + button, " +
            "label[for='interactive'] + button").popover({trigger:'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
              container : $(".widget-wrapper"),
              topSpacing : 41,	//top margin + border of wrapper
              getWidthFrom : $(".widget-wrapper")
          });

        });
      });
    }
  };
})($,gadgets, i18n);

