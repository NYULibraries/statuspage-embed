import StatuspageApi from './statuspageApi';
import config from './config';

const createElementWithAttrs = (tagName, content, attributes) => {
  const elem = document.createElement(tagName);
  Object.keys(attributes).forEach((attr) => {
    elem.setAttribute(attr, attributes[attr]);
  });
  elem.textContent = content;
  return elem;
};

class AlertBanner {
  constructor() {
    this.statuspage = new StatuspageApi();
  }

  bannerClass() {
    const color = config.statusToColorMapping[this.lastStatus];
    return `nyulibraries-alert-banner alert-${color}`;
  }

  insertBanner() {
    const alertBannerDiv = createElementWithAttrs('aside', `${this.message} `, {
      id: 'nyulibraries-alert-banner',
      class: this.bannerClass(),
      'aria-label': 'Service Alert Banner',
    });
    const link = createElementWithAttrs('a', 'See more', { href: this.linkPath, target: '_blank' });
    alertBannerDiv.append(link);
    return document.body.insertBefore(alertBannerDiv, document.body.firstChild);
  }

  static insertStylesheet() {
    const linkDiv = document.createElement('link');
    linkDiv.setAttribute('rel', 'stylesheet');
    linkDiv.setAttribute('type', 'text/css');
    linkDiv.setAttribute('href', config.stylesheetUrl());
    return document.head.appendChild(linkDiv);
  }

  async init() {
    this.constructor.insertStylesheet();
    await this.statuspage.getData();
    if (!this.statuspage.hasMatchingHashtag()) {
      return false;
    }
    this.message = this.statuspage.incidentName();
    this.linkPath = this.statuspage.incidentUrl();
    this.lastStatus = this.statuspage.lastStatus();
    return this.insertBanner();
  }
}

export { AlertBanner as default };
