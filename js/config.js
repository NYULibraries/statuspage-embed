// TODO: Replace with https://alerts-dev.library.nyu.edu/api/v2/summary.json
// See comment for PROD_STATUSPAGE_SUMMARY_URL.  We would first need to create
// the CNAME.
const DEV_STATUSPAGE_SUMMARY_URL = 'https://9bz1fsjktmnp.statuspage.io/api/v2/summary.json'
// TODO: Replace this with https://alerts.library.nyu.edu/api/v2/summary.json,
// which is the value shown in the API settings: https://public.statuspage.io/api/v2#summary
// URLs of the form *.statuspage.io/api/v2/ are deprecated.  Source (response from Daniel Eads):
// "StatusPage.io v2 api subscribers endpoint not returning all subscribers"
// https://community.atlassian.com/forums/Statuspage-questions/StatusPage-io-v2-api-subscribers-endpoint-not-returning-all/qaq-p/944674)
const PROD_STATUSPAGE_SUMMARY_URL = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json'

// determine base url for stylesheet based on environment
function getBaseUrl() {
  switch (process.env.DEPLOY_ENV) {
    case 'production':
      return 'https://cdn.library.nyu.edu/statuspage-embed';
    case 'staging':
      return 'https://cdn-dev.library.nyu.edu/statuspage-embed';
    default:
      return '/dist';
  }
}

function getStatuspageSummaryUrl() {
  const sourceFileHostname = new URL( document.currentScript.src ).hostname;

  // If this is the dev CDN instance of this widget, use the dev Statuspage page
  // API endpoint.
  if (sourceFileHostname === 'cdn-dev.library.nyu.edu') {
    return DEV_STATUSPAGE_SUMMARY_URL;
  }

  // For all other instances of this widget, use the prod Statuspage page.
  return PROD_STATUSPAGE_SUMMARY_URL;
}

// need to factor this out into separate yaml/json file
const config = {
  statusToColorMapping: {
    investigating: 'red',
    identified: 'orange',
    in_progress: 'orange',
    monitoring: 'green',
    resolved: 'green',
    scheduled: 'green',
    verifying: 'green',
  },
  stylesheetPath: '/index.min.css',
};

config.stylesheetUrl = getBaseUrl() + config.stylesheetPath;

export {
  config as default,
  DEV_STATUSPAGE_SUMMARY_URL,
  PROD_STATUSPAGE_SUMMARY_URL,
  getBaseUrl,
  getStatuspageSummaryUrl,
};
