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
    `http://${ LOCALHOST_HOSTNAME }:3000/api/v2/summary.json`;

// Real statuspage summary.json URLs
const DEV_STATUSPAGE_SUMMARY_URL =
    'https://alerts-dev.library.nyu.edu/api/v2/summary.json';
const PROD_STATUSPAGE_SUMMARY_URL =
    'https://alerts.library.nyu.edu/api/v2/summary.json';

function getStylesheetUrl() {
    const cdnStylesheetPath = '/statuspage-embed/index.min.css';

    const sourceFileHostname = getSourceFileHostname();

    switch ( sourceFileHostname ) {
        case DEV_CDN_HOSTNAME:
            return `https://${ DEV_CDN_HOSTNAME }${ cdnStylesheetPath }`;
        case PROD_CDN_HOSTNAME:
            return `https://${ PROD_CDN_HOSTNAME }${ cdnStylesheetPath }`;
        case LOCALHOST_HOSTNAME:
        case DOCKER_COMPOSE_HOSTNAME:
            return `http://${ sourceFileHostname }` +
                   `:${ new URL( document.URL ).port }/index.min.css`;
        default:
            // Should never get here, but just in case...
            return `https://${ sourceFileHostname }${ cdnStylesheetPath }`;
    }
}

// Returns the hostname from which this widget is being served.  It is used for:
// - Determining which stylesheet URL to for the injected <link> tag.
// - Determining which statuspage summary.json URL to use in the fetch.
function getSourceFileHostname() {
    if ( typeof document === 'undefined' ) {
        // Very likely we are in local backend context where this file is being
        // imported for its constants and/or helper functions.
        return LOCALHOST_HOSTNAME;
    }

    // The compiled widget is being loaded via <script> tag into a host page.
    if ( document.currentScript ) {
        return new URL( document.currentScript.src ).hostname;
    } else {
        // Most likely this is the dev server instance loading the widget with HMR.
        // `document.currentScript` is `null`.
        if ( document.location.hostname === LOCALHOST_HOSTNAME ) {
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

    switch ( sourceFileHostname ) {
        // If this is the dev CDN instance of this widget, use the dev Statuspage
        // page API endpoint.
        case DEV_CDN_HOSTNAME:
            return DEV_STATUSPAGE_SUMMARY_URL;

        // These cover the cases for:
        //   - The widget being served from the dev server in a local
        //     development environment.  The statuspage summary CORS proxy will
        //     be running and listening at this URL.
        //   - This config module being imported by a test file in order to get
        //     DRY access to this function.  The statuspage summary CORS proxy
        //     may or may not need to be running, depending on what the test
        //     file is doing.  If running the Playwright tests on local, nothing
        //     needs to be running there because Playwright will intercept the
        //     `fetch` requests to this URL and will return a fake fixture
        //     response.  If importing into an ad hoc script, make sure
        //     something will respond at this URL.
        //   - The widget being served from the `dev` Docker Compose service as
        //     part of the bridge network used by the `e2e-tests` service.  In
        //     this case the URL can be anything as both `dev` and `e2e-tests`
        //     service containers will both be using the same URL thanks to
        //     this fallthrough compound case, which will return the same URL
        //     for http://dev:5173 used by the Playwright controlled browser
        //     and http://localhost:5173 used by the Playwright tests running
        //     in Node.  Playwright will intercept the `fetch` request to this
        //     URL and will return a fake fixture response, so the statuspage
        //     summary CORS proxy does not need to be running on this URL.
        case LOCALHOST_HOSTNAME:
        case DOCKER_COMPOSE_HOSTNAME:
            return LOCAL_STATUSPAGE_SUMMARY_URL;
    }

    // For all other instances of this widget, use the prod Statuspage page.
    return PROD_STATUSPAGE_SUMMARY_URL;
}

// need to factor this out into separate yaml/json file
const config = {
    getStatuspageSummaryUrl,
    getStylesheetUrl,
    statusToColorMapping: {
        investigating: 'red',
        identified   : 'orange',
        in_progress  : 'orange',
        monitoring   : 'green',
        resolved     : 'green',
        scheduled    : 'green',
        verifying    : 'green',
    },

    // Exported for testing purposes only
    DOCKER_COMPOSE_HOSTNAME,
    DEV_STATUSPAGE_SUMMARY_URL,
    LOCAL_STATUSPAGE_SUMMARY_URL,
    PROD_STATUSPAGE_SUMMARY_URL,
};

export {
    config as default,
};
