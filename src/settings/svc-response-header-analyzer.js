angular.module( "risevision.widget.web-page.settings" )
  .factory( "responseHeaderAnalyzer", [ "$log", "$http", function( $log, $http ) {

    var extractOptionsFrom = function( response ) {
      var options = [];

      var xframe = response.headers( "X-Frame-Options" );
      if( xframe !== null && xframe.indexOf( "ALLOW-FROM" ) === -1 ) {
        options.push( "X-Frame-Options" );
      }

      return options.length > 0;
    }

    var factory = {
      getOptions: function( url ) {

        return $http( {
          method: "GET",
          url: "https://proxy.risevision.com/" + url
        } ).then( function( response ) {

          if ( ! response ) {
            return false;
          }

          $log.debug( response.headers() );

          return response.headers() ? extractOptionsFrom( response ) : false;
        }, function( response ) {
          $log.debug( "Webpage request failed with status code " + response.status + ": " + response.statusText );

          return false;
        } );
      }
    };

    return factory;
  } ] );
