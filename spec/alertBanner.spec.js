// Include the alertBanner module
import AlertBanner from '../js/alertBanner';

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
  beforeEach(() => {
    alertBanner.message = 'Some content';
    alertBanner.linkPath = 'http://example.com';
    alertBanner.bannerClass = jest.fn(() => ('mock-banner-class1 mock-banner-class2'));
  });

  it('should not be called automatically', () => {
    expect(document.body.children.length).toBe(1);
  });

  it('should insert banner element when called', () => {
    expect(alertBanner.insertBanner()).toBeTruthy();
    expect(document.body.children.length).toBe(2);
    expect(document.body.firstChild.tagName).toContain('ASIDE');
    expect(document.body.firstChild.classList).toContain('mock-banner-class1');
    expect(document.body.firstChild.classList).toContain('mock-banner-class2');
    expect(document.body.firstChild.innerHTML).toEqual('Some content <a href="http://example.com" target="_blank">See more</a>');
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
    expect(document.head.firstChild.href).toEqual('http://localhost/dist/index.min.css');
    expect(document.head.firstChild.rel).toEqual('stylesheet');
    expect(document.head.firstChild.type).toEqual('text/css');
  });
});

describe('#init', () => {
  let mockHasMatchingHashtag;

  beforeEach(() => {
    AlertBanner.insertStylesheet = jest.fn(() => true);
    alertBanner.insertBanner = jest.fn(() => true);
    alertBanner.statuspage.getData = jest.fn(() => true);
    alertBanner.statuspage.hasMatchingHashtag = jest.fn(() => mockHasMatchingHashtag);
    alertBanner.statuspage.incidentName = jest.fn(() => 'Incident Name');
    alertBanner.statuspage.incidentUrl = jest.fn(() => 'http://example.com/path');
    alertBanner.statuspage.lastStatus = jest.fn(() => 'somestatus');
  });

  describe('with matching hashtag', () => {
    beforeEach(() => {
      mockHasMatchingHashtag = true;
    });

    it('should call helpers in order', async () => {
      await alertBanner.init();
      expect(AlertBanner.insertStylesheet).toHaveBeenCalled();
      expect(alertBanner.statuspage.getData).toHaveBeenCalled();
      expect(alertBanner.insertBanner).toHaveBeenCalled();
    });

    it('should assign values', async () => {
      await alertBanner.init();
      expect(alertBanner.message).toEqual('Incident Name');
      expect(alertBanner.linkPath).toEqual('http://example.com/path');
      expect(alertBanner.lastStatus).toEqual('somestatus');
    });
  });

  describe('without matching hashtag', () => {
    beforeEach(() => {
      mockHasMatchingHashtag = false;
    });

    it('should not call insertBanner', async () => {
      await alertBanner.init();
      expect(AlertBanner.insertStylesheet).toHaveBeenCalled();
      expect(alertBanner.statuspage.getData).toHaveBeenCalled();
      expect(alertBanner.insertBanner).not.toHaveBeenCalled();
    });

    it('should not assign values', async () => {
      await alertBanner.init();
      expect(alertBanner.message).toBeUndefined();
      expect(alertBanner.linkPath).toBeUndefined();
      expect(alertBanner.lastStatus).toBeUndefined();
    });
  });
});
