import StatuspageApi from './statuspageApi';

// This be configurable?
const stylesheetUrl = '/dist/index.min.css';
const colorMapping = {
  investigating: 'red',
  identified: 'orange',
  in_progress: 'orange',
  monitoring: 'green',
  resolved: 'green',
  scheduled: 'green',
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
    const alertBannerDiv = document.createElement('aside');
    alertBannerDiv.setAttribute('id', 'nyulibraries-alert-banner');
    alertBannerDiv.setAttribute('class', this.bannerClass());
    alertBannerDiv.setAttribute('aria-label', 'Service Alert Banner');
    alertBannerDiv.innerHTML = `${this.message}&nbsp;`;
    const link = document.createElement('a');
    link.setAttribute('href', this.linkPath);
    link.setAttribute('target', '_blank');
    link.innerHTML = 'See more';
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
