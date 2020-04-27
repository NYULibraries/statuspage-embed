import config from '../js/config';

describe('#stylesheetUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should set properly for local', () => {
    expect(config.stylesheetUrl()).toEqual('/dist/index.min.css');
  });

  it('should set properly for dev', () => {
    process.env.DEPLOY_ENV = 'dev';
    expect(config.stylesheetUrl()).toEqual('https://cdn-dev.library.nyu.edu/statuspage-embed/index.min.css');
  });

  it('should set properly for prod', () => {
    process.env.DEPLOY_ENV = 'prod';
    expect(config.stylesheetUrl()).toEqual('https://cdn.library.nyu.edu/statuspage-embed/index.min.css');
  });
});
