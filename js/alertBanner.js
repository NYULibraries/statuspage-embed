import getStatuspageData from './getStatuspageData';

// This be configurable?
const stylesheetUrl = '/dist/index.min.css';

class AlertBanner {
  insertBanner() {
    const alertBannerDiv = document.createElement('aside');
    alertBannerDiv.setAttribute('id', 'nyulibraries-alert-banner');
    alertBannerDiv.setAttribute('class', 'nyulibraries-alert-banner');
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
    const data = await getStatuspageData();
    this.message = data.incidents[0].name;
    this.linkPath = data.incidents[0].shortlink;
    return this.insertBanner();
    //getStatuspageData((data) => {
    //  const message = data.incidents[0].name;
    //  const link = data.incidents[0].shortlink;
    //  return insertBanner(message, link);
    //});
  }
}

export { AlertBanner as default, stylesheetUrl };
