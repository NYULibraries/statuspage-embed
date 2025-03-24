import {
  DEV_STATUSPAGE_SUMMARY_URL,
  PROD_STATUSPAGE_SUMMARY_URL,
  getBaseUrl,
  getStatuspageSummaryUrl
} from '../js/config';

describe('getBaseUrl', () => {
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

describe('getStatuspageSummaryUrl', () => {
  it('should return the correct URL for dev CDN widget instance', () => {
    document.currentScript.src = 'https://cdn-dev.library.nyu.edu';
    expect(getStatuspageSummaryUrl()).toEqual(DEV_STATUSPAGE_SUMMARY_URL);
  });

  it('should return the correct URL for prod CDN widget instance', () => {
    document.currentScript.src = 'https://cdn.library.nyu.edu';
    expect(getStatuspageSummaryUrl()).toEqual(PROD_STATUSPAGE_SUMMARY_URL);
  });

  it('should return the correct URL for any instance that is not hosted in dev or prod CDN', () => {
    document.currentScript.src = 'https://some-cdn.company.com';
    expect(getStatuspageSummaryUrl()).toEqual(PROD_STATUSPAGE_SUMMARY_URL);
  });
});
