// Include the alertBanner module
import * as alertBanner from '../js/alertBanner';

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
  it.todo('write test');
});
