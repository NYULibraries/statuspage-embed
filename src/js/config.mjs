// For development
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
        case PROD_CDN_HOSTNAME:
            return 'https://cdn.library.nyu.edu/statuspage-embed';
        case DEV_CDN_HOSTNAME:
            return 'https://cdn-dev.library.nyu.edu/statuspage-embed';
        case LOCALHOST_HOSTNAME:
            // User is most likely viewing the fake host page served by the Vite
            // dev server, which is also going to be serving the widget, so
            // return the current origin.  We use `document.URL` instead of
            // `window.location.href` because we are already using a `document`
            // fake in tests, so it will be more convenient to just add `URL` to
            // it.
            return new URL( document.URL ).origin;
        default:
            // Should never get here, but just in case...
            return `https://${ sourceFileHostname }/statuspage-embed`;
    }
}

function getSourceFileHostname() {
    if ( document.currentScript ) {
        return new URL( document.currentScript.src ).hostname;
    } else if ( document.location.hostname === LOCALHOST_HOSTNAME ) {
        // User is most likely viewing the fake host page served by the Vite
        // dev server, which is also going to be serving the widget.
        return LOCALHOST_HOSTNAME;
    } else {
        // Should never get here!
        throw new Error(
            'ERROR: getSourceFileHostname() can\'t determine hostname',
        );
    }
}

function getStatuspageSummaryUrl() {
    const sourceFileHostname = getSourceFileHostname();

    // If this is the dev CDN instance of this widget, use the dev Statuspage page
    // API endpoint.
    if ( sourceFileHostname === 'cdn-dev.library.nyu.edu' ) {
        return DEV_STATUSPAGE_SUMMARY_URL;
    } else if ( sourceFileHostname === LOCALHOST_HOSTNAME ) {
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
    DEV_STATUSPAGE_SUMMARY_URL,
    LOCAL_STATUSPAGE_SUMMARY_URL,
    PROD_STATUSPAGE_SUMMARY_URL,
    getBaseUrl,
    getStatuspageSummaryUrl,
};
