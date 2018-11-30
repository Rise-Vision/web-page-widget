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
      var header,
        options = [];

      header = response.headers( "X-Frame-Options" );
      console.log( "------------------------------##############" ) // eslint-disable-line no-console
      console.log( typeof header ) // eslint-disable-line no-console
      if ( header !== null && header.indexOf( "ALLOW-FROM" ) === -1 ) {
        options.push( "X-Frame-Options" );
      }

      header = response.headers( "content-security-policy" );
      if ( header !== null && header.indexOf( "frame-ancestors" ) > 0 ) {
        options.push( "frame-ancestors" );
      }

      return options;
    }

    return factory;
  } ] );
