import StatuspageApi from './statuspageApi';

// This be configurable?
//const stylesheetUrl = '/dist/index.min.css';
const stylesheetUrl = 'https://cdn-dev.library.nyu.edu/statuspage-embed/index.min.css';
const colorMapping = {
  investigating: 'red',
  identified: 'orange',
  in_progress: 'orange',
  monitoring: 'green',
  resolved: 'green',
  scheduled: 'green',
};

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
    const color = colorMapping[this.lastStatus];
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
    linkDiv.setAttribute('href', stylesheetUrl);
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

export { AlertBanner as default, stylesheetUrl };
