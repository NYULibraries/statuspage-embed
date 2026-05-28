// For development
const DOCKER_COMPOSE_HOSTNAME = 'dev';
const LOCALHOST_HOSTNAME = 'localhost';

// Real hosts
const DEV_CDN_HOSTNAME = 'cdn-dev.library.nyu.edu';
const PROD_CDN_HOSTNAME = 'cdn.library.nyu.edu';

const FAKE_STATUSPAGE_SUMMARY_URL =
    'http://fake-statuspage-url/api/v2/summary.json';
// This URL will hit the `tools/statuspage-summary-cors-proxy.mjs` server, which
// needs to be running before the widget loads.  The proxy script imports this
// module and will listen on the port used in this URL, so if a different port
// number needs to be used, it can be changed here without having to make the
// same change in the proxy script.
const LOCAL_STATUSPAGE_SUMMARY_URL =
    `http://${ LOCALHOST_HOSTNAME }:3000/api/v2/summary.json`;

// Real statuspage summary.json URLs
const DEV_STATUSPAGE_SUMMARY_URL =
    'https://alerts-dev.library.nyu.edu/api/v2/summary.json';
const PROD_STATUSPAGE_SUMMARY_URL =
    'https://alerts.library.nyu.edu/api/v2/summary.json';

// determine base url for stylesheet based on environment
function getBaseUrl() {
    const sourceFileHostname = getSourceFileHostname();

    switch ( sourceFileHostname ) {
        case DEV_CDN_HOSTNAME:
            return `https://${ DEV_CDN_HOSTNAME }/statuspage-embed`;
        case PROD_CDN_HOSTNAME:
            return `https://${ PROD_CDN_HOSTNAME }/statuspage-embed`;
        // The widget is most likely loaded into the fake host page served by
        // the Vite dev server.  `DOCKER_COMPOSE_HOSTNAME` is used when running
        // the Docker Compose service `e2e-tests`, which accesses the dev server
        // Docker Compose service through a bridge network.  It's also possible
        // that this `config` module is being imported into test script for DRY
        // access to the URL building stuff.
        case LOCALHOST_HOSTNAME:
        case DOCKER_COMPOSE_HOSTNAME:
            return `http://${ sourceFileHostname }` +
                   `:${ new URL( document.URL ).port }`;
        default:
            // Should never get here, but just in case...
            return `https://${ sourceFileHostname }/statuspage-embed`;
    }
}

// Returns the hostname from which this widget is being served.  It is used for:
// - Determining which stylesheet URL to for the injected <link> tag.
// - Determining which statuspage summary.json URL to use in the fetch.
function getSourceFileHostname() {
    if ( typeof document === 'undefined' ) {
        console.log( '[INFO] getSourceFileHostname(): `document` is undefined' );

        // Very likely we are in local backend context where this file is being
        // imported for its constants and/or helper functions.
        return LOCALHOST_HOSTNAME;
    }

    // The compiled widget is being loaded via <script> tag into a host page.
    if ( document.currentScript ) {
        console.log( `[INFO] getSourceFileHostname(): document.currentScript === "${ document.currentScript }"` );

        return new URL( document.currentScript.src ).hostname;
    } else {
        // Most likely this the dev server instance loading the widget with HMR.
        // `document.currentScript` is `null`.
        console.log( `[INFO] getSourceFileHostname(): document.location.hostname === ${ document.location.hostname }` );

        if ( document.location.hostname === LOCALHOST_HOSTNAME ) {
            // User is most likely viewing the fake host page served by the Vite
            // dev server, which is also going to be serving the widget.
            return LOCALHOST_HOSTNAME;
        } else if ( document.location.hostname === DOCKER_COMPOSE_HOSTNAME ) {
            // User is most likely running the Docker Compose `e2e-tests`
            // service, which uses a bridge network to allow the tests container
            // to access the dev server container.
            return DOCKER_COMPOSE_HOSTNAME;
        } else {
            // Should never get here!
            throw new Error(
                'ERROR: getSourceFileHostname() can\'t determine hostname',
            );
        }
    }
}

function getStatuspageSummaryUrl() {
    const sourceFileHostname = getSourceFileHostname();

    console.log( `[INFO] getStatuspageSummaryUrl(): sourceFileHostname === "${ sourceFileHostname }"` );

    switch ( sourceFileHostname ) {
        // If this is the dev CDN instance of this widget, use the dev Statuspage page
        // API endpoint.
        case DEV_CDN_HOSTNAME:
            return DEV_STATUSPAGE_SUMMARY_URL;

        //   - The widget being served from the dev server Docker Compose
        //     service as part of the bridge network used to allow the
        //     `e2e-tests` Docker Compose service access it.  The widget is
        //     being served from the from `DOCKER_COMPOSE_HOSTNAME` (named after
        //     the Docker Compose service), but when Playwright calls this
        //     function to get a URL to use in its network routing for
        //     intercepting the statuspage request, it will be doing so from
        //     a `localhost` context, so both calls to this function must return
        //     the same URL.  The actual URL doesn't matter since it is
        //     intercepted by Playwright.
        case LOCALHOST_HOSTNAME:
            return LOCAL_STATUSPAGE_SUMMARY_URL;
        case DOCKER_COMPOSE_HOSTNAME:
            // It doesn't matter what this URL is, because the Playwright test
            // suite running in the `e2e-tests` service will make its own call
            // to this function in order to intercept the `fetch` call to this
            // URL and respond with a fake summary.json.
            return FAKE_STATUSPAGE_SUMMARY_URL;
    }

    // For all other instances of this widget, use the prod Statuspage page.
    return PROD_STATUSPAGE_SUMMARY_URL;
}

// need to factor this out into separate yaml/json file
const config = {
    getStylesheetUrl: function() {
        return getBaseUrl() + '/index.min.css';
    },
    statusToColorMapping: {
        investigating: 'red',
        identified   : 'orange',
        in_progress  : 'orange',
        monitoring   : 'green',
        resolved     : 'green',
        scheduled    : 'green',
        verifying    : 'green',
    },
};

export {
    config as default,
    getStatuspageSummaryUrl,

    // Exported for testing purposes only
    DOCKER_COMPOSE_HOSTNAME,
    DEV_STATUSPAGE_SUMMARY_URL,
    FAKE_STATUSPAGE_SUMMARY_URL,
    LOCAL_STATUSPAGE_SUMMARY_URL,
    PROD_STATUSPAGE_SUMMARY_URL,
    getBaseUrl,
};
