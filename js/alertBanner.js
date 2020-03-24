const alertBannerContent = () => {
  // Get this from StatusPage public API
  return 'As of March 14, NYU Libraries services are all online. Library spaces are closed until further notice. <a href="https://nyulibraries.statuspage.io" target="_blank">See more</a>';
};

const alertBanner = () => {
  const alertBannerDiv = document.createElement("aside");
  alertBannerDiv.setAttribute("id", "nyulibraries-alert-banner");
  alertBannerDiv.setAttribute("class", "nyulibraries-alert-banner");
  alertBannerDiv.setAttribute("aria-label", "Service Alert Banner");
  alertBannerDiv.innerHTML = alertBannerContent();
  document.body.insertBefore(alertBannerDiv, document.body.firstChild);
};

export { alertBanner };