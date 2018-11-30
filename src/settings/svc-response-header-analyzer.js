angular.module( "risevision.widget.web-page.settings" )
  .factory( "responseHeaderAnalyzer", [ "$log", "$http", function( $log, $http ) {

    var factory = {
      hasOptions: function( url ) {

        return $http( {
          method: "GET",
          url: "https://proxy.risevision.com/" + url
        } ).then( function( response ) {
          var xframe;

          $log.debug( response.headers() );

          if ( response && response.headers() ) {
            xframe = response.headers( "X-Frame-Options" );
            return xframe !== null && xframe.indexOf( "ALLOW-FROM" ) === -1;
          }

        }, function( response ) {
          $log.debug( "Webpage request failed with status code " + response.status + ": " + response.statusText );
        } );
      }
    };

    return factory;
  } ] );
