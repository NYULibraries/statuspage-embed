const DEV_CDN_HOSTNAME = 'cdn-dev.library.nyu.edu';
const PROD_CDN_HOSTNAME = 'cdn.library.nyu.edu';

const DEV_STATUSPAGE_SUMMARY_URL =
    'https://alerts-dev.library.nyu.edu/api/v2/summary.json';
const PROD_STATUSPAGE_SUMMARY_URL =
    'https://alerts.library.nyu.edu/api/v2/summary.json';

// determine base url for stylesheet based on environment
function getBaseUrl() {
    const sourceFileHostname = new URL( document.currentScript.src ).hostname;

    switch ( sourceFileHostname ) {
        case PROD_CDN_HOSTNAME:
            return 'https://cdn.library.nyu.edu/statuspage-embed';
        case DEV_CDN_HOSTNAME:
            return 'https://cdn-dev.library.nyu.edu/statuspage-embed';
        default:
            return '/dist';
    }
}

function getStatuspageSummaryUrl() {
    const sourceFileHostname = new URL( document.currentScript.src ).hostname;

    // If this is the dev CDN instance of this widget, use the dev Statuspage page
    // API endpoint.
    if ( sourceFileHostname === 'cdn-dev.library.nyu.edu' ) {
        return DEV_STATUSPAGE_SUMMARY_URL;
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
    PROD_STATUSPAGE_SUMMARY_URL,
    getBaseUrl,
    getStatuspageSummaryUrl,
};
