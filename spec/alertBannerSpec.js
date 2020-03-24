// Include the alertBanner module
const alertBanner = require("../dist/alertBanner.js");

// Mock the DOM with JSDOM
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`<!DOCTYPE html><html><head></head><body><div class="container"></div></body></html`)).window;
global.document = document;

describe("alertBanner", () => {

  describe("#bannerContent", () => {
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
