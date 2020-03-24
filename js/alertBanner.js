const stylesheetUrl = "/dist/index.min.css";

const bannerContent = () => {
  // Get this from StatusPage public API
  // https://nyulibraries.statuspage.io/api
  return 'As of March 14, NYU Libraries services are all online. Library spaces are closed until further notice. <a href="https://nyulibraries.statuspage.io" target="_blank">See more</a>';
};

const insertBanner = () => {
  const alertBannerDiv = document.createElement("aside");
  alertBannerDiv.setAttribute("id", "nyulibraries-alert-banner");
  alertBannerDiv.setAttribute("class", "nyulibraries-alert-banner");
  alertBannerDiv.setAttribute("aria-label", "Service Alert Banner");
  alertBannerDiv.innerHTML = bannerContent();
  document.body.insertBefore(alertBannerDiv, document.body.firstChild);
  return true;
};

const insertStylesheet = () => {
  const linkDiv = document.createElement("link");
  linkDiv.setAttribute("rel", "stylesheet");
  linkDiv.setAttribute("type", "text/css");
  // This be configurable?
  linkDiv.setAttribute("href", stylesheetUrl);
  document.getElementsByTagName('head')[0].appendChild(linkDiv);
  return true;
};

const init = () => {
  insertStylesheet() && insertBanner();
};

module.exports = { 
  init,
  insertStylesheet,
  insertBanner,
  stylesheetUrl,
  bannerContent
};