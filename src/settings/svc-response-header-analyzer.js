angular.module( "risevision.widget.web-page.settings" )
  .factory( "responseHeaderAnalyzer", [ "$log", "$http", function( $log, $http ) {

    var factory = {
      getOptions: function( url ) {

        return $http( {
          method: "GET",
          url: "https://proxy.risevision.com/" + url
        } ).then( function( response ) {

          if ( !response ) {
            return [];
          }

          $log.debug( response.headers() );

          return response.headers() ? extractOptionsFrom( response ) : [];
        }, function( response ) {
          $log.debug( "Webpage request failed with status code " + response.status + ": " + response.statusText );

          return [];
        } );
      }
    };

    function extractOptionsFrom( response ) {
      var options = [],
        xframe;

      xframe = response.headers( "X-Frame-Options" );
      if ( xframe !== null && xframe.indexOf( "ALLOW-FROM" ) === -1 ) {
        options.push( "X-Frame-Options" );
      }

      return options;
    }

    return factory;
  } ] );
