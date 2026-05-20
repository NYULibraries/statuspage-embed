import * as http from 'http';
import { LOCAL_STATUSPAGE_SUMMARY_URL } from '../../src/js/config.mjs';

// `Internal` statuspage: https://internal18.statuspage.io/
const DEFAULT_STATUSPAGE_URL_TO_PROXY =
    'https://66x84091slz4.statuspage.io/api/v2/summary.json';

// An API key is required if `STATUSPAGE_URL` points to a private statuspage.
const API_KEY = process.env.API_KEY;
// URL of server to proxy.  It can be a real statuspage URL or the URL for a
// fake summary.json file (served without the necessary CORS header).
const STATUSPAGE_URL_TO_PROXY = process.env.STATUSPAGE_URL ||
                                DEFAULT_STATUSPAGE_URL_TO_PROXY;

try {
    new URL( STATUSPAGE_URL_TO_PROXY );
} catch( e ) {
    console.error(
        `STATUSPAGE_URL_TO_PROXY value "${ STATUSPAGE_URL_TO_PROXY }"` +
        ` is not a valid URL.  Error: "${ e }"` );

    process.exit( 1 );
}

// The proxy server port number is taken from the widget's own config URL for
// DRY-ness.
const localStatuspageSummaryUrl = new URL( LOCAL_STATUSPAGE_SUMMARY_URL );
const port = localStatuspageSummaryUrl.port;

const server = http.createServer();

// This listener will return the proxied summary.json file for every request path.
async function requestListener( request, response ) {
    // Note that private statuspage URLs will load fine in a browser, but `fetch`
    // requests get HTTP 401 error responses:
    // "Your page is inactive. Please include an API key to access this resource."
    //  ...unless a valid API key is provided in the `api_key` query param.
    // If `STATUSPAGE_URL_TO_PROXY` is for a fake summary.json file being served
    // for testing purposes, the query string will (should!) be ignored.
    const fetchInput = `${ STATUSPAGE_URL_TO_PROXY }?api_key=${ API_KEY }`;

    let statusPageResponse;
    try {
        statusPageResponse = await fetch( fetchInput );

        const summaryJson = await statusPageResponse.text();

        response.setHeader( 'Access-Control-Allow-Origin', '*' );
        response.setHeader( 'Content-Type', 'application/json' );
        response.writeHead( 200 );
        response.end( summaryJson );
    } catch( e ) {
        console.error(
            `ERROR: \`fetch("${ fetchInput }")\` failed with error: "${ e }"` );

        response.setHeader( 'Content-Type', 'text/plain' );
        response.writeHead( 422 );
        response.end();
    }
}

server.on( 'request', requestListener );
server.listen( port );

console.log( `Local proxy: http://localhost:${ port }
Proxied statuspage: ${ STATUSPAGE_URL_TO_PROXY }` );
