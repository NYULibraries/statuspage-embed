// Include the alertBanner module
import AlertBanner, { stylesheetUrl } from '../js/alertBanner';

let alertBanner;

// Setup DOM for testing
beforeEach(() => {
  document.body.innerHTML = '<div class="container"></div>';
  alertBanner = new AlertBanner();
});

describe('#bannerClass', () => {
  it('should return red when investigating', () => {
    alertBanner.lastStatus = 'investigating';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-red');
  });

  it('should return orange when identified', () => {
    alertBanner.lastStatus = 'identified';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-orange');
  });

  it('should return orange when in_progress', () => {
    alertBanner.lastStatus = 'in_progress';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-orange');
  });

  it('should return green when monitoring', () => {
    alertBanner.lastStatus = 'monitoring';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-green');
  });

  it('should return green when resolved', () => {
    alertBanner.lastStatus = 'resolved';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-green');
  });

  it('should return green when scheduled', () => {
    alertBanner.lastStatus = 'scheduled';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-green');
  });

  it('should return undefined when unrecognized', () => {
    alertBanner.lastStatus = 'something else';
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-undefined');
  });

  it('should return undefined when blank', () => {
    expect(alertBanner.bannerClass()).toEqual('nyulibraries-alert-banner alert-undefined');
  });
});

describe('#insertBanner', () => {
  it('should not be called automatically', () => {
    expect(document.body.children.length).toBe(1);
  });

  it('should insert banner element when called', () => {
    alertBanner.message = 'Some content';
    alertBanner.linkPath = 'http://example.com';
    expect(alertBanner.insertBanner()).toBeTruthy();
    expect(document.body.children.length).toBe(2);
    expect(document.body.firstChild.tagName).toContain('ASIDE');
    expect(document.body.firstChild.classList).toContain('nyulibraries-alert-banner');
    expect(document.body.firstChild.classList).toContain('alert-undefined');
    expect(document.body.firstChild.innerHTML).toEqual('Some content&nbsp;<a href="http://example.com" target="_blank">See more</a>');
  });
});

describe('#insertStylesheet', () => {
  it('should not be called automatically', () => {
    expect(document.head.children.length).toBe(0);
  });

  it('should insert stylesheet when called', () => {
    expect(AlertBanner.insertStylesheet()).toBeTruthy();
    expect(document.head.children.length).toBe(1);
    expect(document.head.firstChild.tagName).toEqual('LINK');
    expect(document.head.firstChild.href).toEqual(`http://localhost${stylesheetUrl}`);
    expect(document.head.firstChild.rel).toEqual('stylesheet');
    expect(document.head.firstChild.type).toEqual('text/css');
  });
});

describe('#init', () => {
  let mockData;
  let body;

  beforeEach(() => {
    jest.spyOn(AlertBanner, 'insertStylesheet').mockImplementation(() => true);
    jest.spyOn(alertBanner, 'insertBanner').mockImplementation(() => true);
    body = "There's gonna be a #majoroutage tonight";
    mockData = { incidents: [{ name: 'Test Name', shortlink: 'http://example.com', incident_updates: [{ body, status: 'identified' }] }] };
    jest.spyOn(alertBanner.statuspage, 'getData').mockImplementation(() => {
      alertBanner.statuspage.data = mockData;
    });
  });

  it('should call helpers in order', async () => {
    await alertBanner.init();
    expect(AlertBanner.insertStylesheet).toHaveBeenCalled();
    expect(alertBanner.statuspage.getData).toHaveBeenCalled();
    expect(alertBanner.insertBanner).toHaveBeenCalled();
  });

  it('should assign values', async () => {
    await alertBanner.init();
    expect(alertBanner.message).toEqual(mockData.incidents[0].name);
    expect(alertBanner.linkPath).toEqual(mockData.incidents[0].shortlink);
  });

  describe('when body has no hashtag', () => {
    beforeEach(() => {
      body = 'Something without a hashtag';
    });

    xit('should not call insertBanner', async () => {
      await alertBanner.init();
      expect(AlertBanner.insertStylesheet).toHaveBeenCalled();
      expect(alertBanner.statuspage.getData).toHaveBeenCalled();
      expect(alertBanner.insertBanner).not.toHaveBeenCalled();
    });
  });
});
