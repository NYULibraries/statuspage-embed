import getStatuspageData from './getStatuspageData';

const stylesheetUrl = '/dist/index.min.css';

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
  return document.head.appendChild(linkDiv);
};

const init = async () => {
  insertStylesheet();
  const data = await getStatuspageData();
  const message = data.incidents[0].name;
  const link = data.incidents[0].shortlink;
  return insertBanner(message, link);
  //getStatuspageData((data) => {
  //  const message = data.incidents[0].name;
  //  const link = data.incidents[0].shortlink;
  //  return insertBanner(message, link);
  //});
};

export { insertBanner, insertStylesheet, init, stylesheetUrl };
