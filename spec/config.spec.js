import { getBaseUrl } from '../js/config';

describe('#getBaseUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should set properly for local', () => {
    expect(getBaseUrl()).toEqual('/dist');
  });

  it('should set properly for staging', () => {
    process.env.DEPLOY_ENV = 'staging';
    expect(getBaseUrl()).toEqual('https://cdn-dev.library.nyu.edu/statuspage-embed');
  });

  it('should set properly for production', () => {
    process.env.DEPLOY_ENV = 'production';
    expect(getBaseUrl()).toEqual('https://cdn.library.nyu.edu/statuspage-embed');
  });
});
