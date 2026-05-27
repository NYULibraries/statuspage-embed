// For development
const DOCKER_COMPOSE_HOSTNAME = 'dev';
const LOCALHOST_HOSTNAME = 'localhost';

// Real hosts
const DEV_CDN_HOSTNAME = 'cdn-dev.library.nyu.edu';
const PROD_CDN_HOSTNAME = 'cdn.library.nyu.edu';

// This URL will hit the `tools/statuspage-summary-cors-proxy.mjs` server, which
// needs to be running before the widget loads.  The proxy script imports this
// module and will listen on the port used in this URL, so if a different port
// number needs to be used, it can be changed here without having to make the
// same change in the proxy script.
const LOCAL_STATUSPAGE_SUMMARY_URL =
    'http://localhost:3000/api/v2/summary.json';

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
            return 'https://cdn-dev.library.nyu.edu/statuspage-embed';
        case DOCKER_COMPOSE_HOSTNAME:
            return new URL( document.URL ).origin;
        case LOCALHOST_HOSTNAME:
            // User is most likely viewing the fake host page served by the Vite
            // dev server, which is also going to be serving the widget, so
            // return the current origin.  We use `document.URL` instead of
            // `window.location.href` because we are already using a `document`
            // fake in tests, so it will be more convenient to just add `URL` to
            // it.
            return new URL( document.URL ).origin;
        case PROD_CDN_HOSTNAME:
            return 'https://cdn.library.nyu.edu/statuspage-embed';
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
        case 'cdn-dev.library.nyu.edu':
            return DEV_STATUSPAGE_SUMMARY_URL;
        // These cover cases where this function is called in the context of:
        //   - The widget being served from a local dev server instance in a
        //     standard development workflow.
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
        case DOCKER_COMPOSE_HOSTNAME:
            return LOCAL_STATUSPAGE_SUMMARY_URL;
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
    DEV_STATUSPAGE_SUMMARY_URL,
    DOCKER_COMPOSE_HOSTNAME,
    LOCAL_STATUSPAGE_SUMMARY_URL,
    PROD_STATUSPAGE_SUMMARY_URL,
    getBaseUrl,
};
