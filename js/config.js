// determine base url for stylesheet based on environment
const getBaseUrl = () => {
  switch (process.env.DEPLOY_ENV) {
    case 'production':
      return 'https://cdn.library.nyu.edu/statuspage-embed';
    case 'staging':
      return 'https://cdn-dev.library.nyu.edu/statuspage-embed';
    default:
      return '/dist';
  }
};

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
  // The official URL is documented at https://alerts.library.nyu.edu/api/v2/,
  // section "Summary".
  // The "https://kyyfz4489y7m.statuspage.io/api/v2/summary.json" URL works, but
  // it is deprecated. See response from Daniel Eads in this forum post page:
  // https://community.atlassian.com/forums/Statuspage-questions/StatusPage-io-v2-api-subscribers-endpoint-not-returning-all/qaq-p/944674
  statuspageUrl: 'https://alerts.library.nyu.edu/api/v2/summary.json',
};

config.stylesheetUrl = getBaseUrl() + config.stylesheetPath;

export { config as default, getBaseUrl };
