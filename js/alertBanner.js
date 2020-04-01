const stylesheetUrl = '/dist/index.min.css';
const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';

const getStatuspageData = (callback) => {
  fetch(statuspageUrl).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw Error(response.statusText);
  }).then((data) => {
    callback(data);
  });
};

const insertBanner = (bannerMessage, linkPath) => {
  const alertBannerDiv = document.createElement('aside');
  alertBannerDiv.setAttribute('id', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('class', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('aria-label', 'Service Alert Banner');
  alertBannerDiv.innerHTML = `${bannerMessage}&nbsp;`;
  const link = document.createElement('a');
  link.setAttribute('href', linkPath);
  link.setAttribute('target', '_blank');
  link.innerHTML = 'See more';
  alertBannerDiv.append(link);
  return document.body.insertBefore(alertBannerDiv, document.body.firstChild);
};

const insertStylesheet = () => {
  const linkDiv = document.createElement('link');
  linkDiv.setAttribute('rel', 'stylesheet');
  linkDiv.setAttribute('type', 'text/css');
  // This be configurable?
  linkDiv.setAttribute('href', stylesheetUrl);
  document.getElementsByTagName('head')[0].appendChild(linkDiv);
  return true;
};

const init = () => {
  insertStylesheet();
  getStatuspageData((data) => {
    const message = data.incidents[0].name;
    const link = data.incidents[0].shortlink;
    insertBanner(message, link);
  });
};

export { getStatuspageData, insertBanner, insertStylesheet, init };
