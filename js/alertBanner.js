import { http as https } from 'http';

const stylesheetUrl = '/dist/index.min.css';
const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';

const getStatuspageData = (callback) => {
  https.get(statuspageUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      callback(JSON.parse(data));
    });
  }).on('error', (err) => {
    console.log('Unable to load banner data: ' + err.message);
  });
};

const insertBanner = (bannerContent) => {
  const alertBannerDiv = document.createElement('aside');
  alertBannerDiv.setAttribute('id', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('class', 'nyulibraries-alert-banner');
  alertBannerDiv.setAttribute('aria-label', 'Service Alert Banner');
  alertBannerDiv.innerHTML = bannerContent;
  document.body.insertBefore(alertBannerDiv, document.body.firstChild);
  return true;
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
    console.log(data);
    const message = data.incidents[0].name;
    insertBanner(message);
  });
};
export { init as init };

//module.exports = {
//  init,
//  insertStylesheet,
//  insertBanner,
//  stylesheetUrl,
////  getStatuspageData,
//};
