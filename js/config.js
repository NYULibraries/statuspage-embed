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
  statuspageUrl: 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json',
};

config.stylesheetUrl = getBaseUrl() + config.stylesheetPath;

export { config as default, getBaseUrl };
