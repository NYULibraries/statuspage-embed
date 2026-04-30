import * as http from 'http';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const fakeHostPageFile = path.join( import.meta.dirname, 'html', 'index.html' );
const fakeHostPageRequestPath = '/';

const listenOn = 'http://localhost:3000';

const main = http.createServer();

function getContentType( pathname ) {
    const fileExtension = pathname.split( '.' ).pop();

    switch ( fileExtension ) {
        case 'css':
            return 'text/css; charset=UTF-8';
        case 'html':
            return 'text/html';
        case 'js':
            return 'application/javascript';
        default:
            return '';
    }
}

// Serve the fake minimal host page from `./html/` and the widget assets from
// `./dist/`.
function requestListener( request, response ) {
    console.log( `[ REQUEST ] ${ request.method } ${ request.url }` );

    const requestPathname = new URL( request.url, listenOn ).pathname;
    let file;
    if ( requestPathname === fakeHostPageRequestPath ) {
        file = fakeHostPageFile;
    } else if ( requestPathname.startsWith( '/dist/' ) ) {
        file = path.join(
            import.meta.dirname, '..', '..', requestPathname,
        );
    } else {
        // In theory should never get here, but at least one unexpected
        // `requestPathname` has been encountered (when Developer Tools was open):
        // "/.well-known/appspecific/com.chrome.devtools.json"
    }

    fs.readFile( file )
        .then( contents => {
            response.setHeader( 'Access-Control-Allow-Origin', '*' );
            response.setHeader(
                'Content-Type',
                getContentType( requestPathname ),
            );
            response.writeHead( 200 );
            response.end( contents );

            console.log( `[ RESPONSE ] ${ file }` );
        } )
        .catch( err => {
            response.writeHead( 404 );
            response.end( `${ request.pathname } not found` );

            console.error( `[ ERROR ] ${ err.message }` );
        } );
}

main.on( 'request', requestListener );

main.listen( new URL( listenOn ).port );

console.log( `Fake host page server started on ${ listenOn }` );
