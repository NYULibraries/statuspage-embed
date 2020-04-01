// Include the alertBanner module
import * as alertBanner from '../js/alertBanner';

// Setup DOM for testing
beforeEach(() => {
  document.body.innerHTML = '<div class="container">';
});

describe('#getStatuspageData', () => {
  it.todo('write test');
});

describe('#insertBanner', () => {
  it('should not be called automatically', () => {
    expect(document.body.children.length).toBe(1);
  });

  it('should insert element when called', () => {
    expect(alertBanner.insertBanner('Some content')).toBeTruthy();
    expect(document.body.children.length).toBe(2);
    expect(document.body.firstChild.classList).toContain('nyulibraries-alert-banner');
    expect(document.body.firstChild.innerHTML).toEqual('Some content');
  });
});

describe('#insertStylesheet', () => {
  it.todo('write test');
});

describe('#init', () => {
  it.todo('write test');
});
