const stylesheetUrl = '/dist/index.min.css';
const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';

export const getStatuspageData = (callback) => {
  fetch(statuspageUrl).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw Error(response.statusText);
  }).then((data) => {
    callback(data);
  });
};

export const insertBanner = (bannerContent) => {
  const alertBannerDiv = document.createElement('aside');
  alertBannerDiv.setAttribute('id', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('class', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('aria-label', 'Service Alert Banner');
  alertBannerDiv.innerHTML = bannerContent;
  document.body.insertBefore(alertBannerDiv, document.body.firstChild);
  return true;
};

export const insertStylesheet = () => {
  const linkDiv = document.createElement('link');
  linkDiv.setAttribute('rel', 'stylesheet');
  linkDiv.setAttribute('type', 'text/css');
  // This be configurable?
  linkDiv.setAttribute('href', stylesheetUrl);
  document.getElementsByTagName('head')[0].appendChild(linkDiv);
  return true;
};

export const init = () => {
  insertStylesheet();
  getStatuspageData((data) => {
    const message = data.incidents[0].name;
    insertBanner(message);
  });
};
