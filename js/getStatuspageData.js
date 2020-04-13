const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';

//const getData = (callback) => {
  //fetch(statuspageUrl).then((response) => {
  //  if (response.status >= 200 && response.status < 300) {
  //    return response.json();
  //  }
  //  throw Error(response.statusText);
  //}).then((data) => {
  //  callback(data);
  //});
const getData = async () => {
  const response = await fetch(statuspageUrl);
  const data = await response.json();
  return data;
};

export { getData as default }
