
// Include the alertBanner module
import * as alertBanner from '../js/alertBanner';
import getStatuspageData from '../js/getStatuspageData';

jest.mock('../js/getStatuspageData');

// Setup DOM for testing
beforeEach(() => {
  document.body.innerHTML = '<div class="container"></div>';
});

describe('#getStatuspageData', () => {
  it.todo('write test');
});

describe('#insertBanner', () => {
  it('should not be called automatically', () => {
    expect(document.body.children.length).toBe(1);
  });

  it('should insert banner element when called', () => {
    expect(alertBanner.insertBanner('Some content', 'http://example.com')).toBeTruthy();
    expect(document.body.children.length).toBe(2);
    expect(document.body.firstChild.tagName).toContain('ASIDE');
    expect(document.body.firstChild.classList).toContain('nyulibraries-alert-banner');
    expect(document.body.firstChild.innerHTML).toEqual('Some content&nbsp;<a href="http://example.com" target="_blank">See more</a>');
  });
});

describe('#insertStylesheet', () => {
  it('should not be called automatically', () => {
    expect(document.head.children.length).toBe(0);
  });

  it('should insert stylesheet when called', () => {
    expect(alertBanner.insertStylesheet()).toBeTruthy();
    expect(document.head.children.length).toBe(1);
    expect(document.head.firstChild.tagName).toEqual('LINK');
    expect(document.head.firstChild.href).toEqual(`http://localhost${alertBanner.stylesheetUrl}`);
    expect(document.head.firstChild.rel).toEqual('stylesheet');
    expect(document.head.firstChild.type).toEqual('text/css');
  });
});

describe('#init', () => {
  let mockData;

  beforeEach(() => {
    alertBanner.insertStylesheet = jest.fn();
    alertBanner.insertBanner = jest.fn();
    //alertBanner.getStatuspageData = jest.fn();
    //jest.spyOn(alertBanner, 'getStatuspageData').mockImplementation(() => true);
    //jest.spyOn(alertBanner, 'insertStylesheet').mockImplementation(() => true);
    //jest.spyOn(alertBanner, 'insertBanner').mockImplementation(() => true);
    mockData = {incidents: [{name: 'Test Name', shortlink: 'http://example.com'}]};
    getStatuspageData.mockImplementation(() => mockData);
  });

  it('should call helpers in order', async () => {
    //alertBanner.insertStylesheet = jest.fn();
    //alertBanner.insertBanner = jest.fn();
    //alertBanner.getStatuspageData = jest.fn();
    //getStatuspageData.mockImplementation((callback) => {
    //  callback(mockData);
    //  expect(alertBanner.insertStylesheet.mock.calls.length).toBe(1);
    //  expect(alertBanner.insertBanner.mock.calls.length).toBe(1);
    //  expect(alertBanner.insertBanner).toBeCalled();
    //  done();
    //});
    //expect(alertBanner.insertBanner('blah', 'blah')).toEqual(true);
    //await expect(alertBanner.init()).resolves.toEqual(true);
    alertBanner.init();
    //alertBanner.insertStylesheet();
    expect(alertBanner.insertStylesheet).toHaveBeenCalled();
    expect(getStatuspageData).toHaveBeenCalled();
    //expect(alertBanner.insertStylesheet).toHaveBeenCalled();
    //expect(alertBanner.insertBanner).toHaveBeenCalled();
    //expect(alertBanner.insertStylesheet.mock.calls.length).toBe(1);
    expect(alertBanner.insertBanner).toHaveBeenCalled();
  });
});
