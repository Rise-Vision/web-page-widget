angular.module( "risevision.widget.web-page.settings" )
  .factory( "xframeOptions", [ "$log", "$http", function( $log, $http ) {

    var factory = {
      hasOptions: function( url ) {

        return $http( {
          method: "GET",
          url: "https://proxy.risevision.com/" + url
        } ).then( function( response ) {

          $log.debug( response.headers() );

          if ( response && response.headers() ) {
            return response.headers( "X-Frame-Options" ) !== null;
          }

        }, function( response ) {
          $log.debug( "Webpage request failed with status code " + response.status + ": " + response.statusText );
        } );
      }
    };

    return factory;
  } ] );
