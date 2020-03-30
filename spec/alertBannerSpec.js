// https://jasmine.github.io/api/3.5/global
// https://jasmine.github.io/pages/docs_home.html

// Include the alertBanner module
import * as alertBanner from "../js/alertBanner.js";

// Mock the DOM with JSDOM
// https://github.com/jsdom/jsdom
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`<!DOCTYPE html><html><head></head><body><div class="container"></div></body></html`)).window;
global.document = document;

describe("alertBanner", () => {

  xdescribe("#bannerContent", () => {
    it("is expected to be static content", () => {
      expect(alertBanner.bannerContent()).toBe('As of March 14, NYU Libraries services are all online. Library spaces are closed until further notice. <a href="https://nyulibraries.statuspage.io" target="_blank">See more</a>');
    });
  });

  describe("#insertBanner", () => {
    beforeEach(() => {
      alertBanner.insertBanner();
    });
    it("is expected to insert the banner element", () => {
      expect(document.body.children.length).toBe(2);
    });
  });

});
