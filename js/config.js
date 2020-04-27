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

const config = {
  statusToColorMapping: {
    investigating: 'red',
    identified: 'orange',
    in_progress: 'orange',
    monitoring: 'green',
    resolved: 'green',
    scheduled: 'green',
  },
  stylesheetPath: '/index.min.css',
  statuspageUrl: 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json',
};

config.stylesheetUrl = getBaseUrl() + config.stylesheetPath;

export { config as default, getBaseUrl };
