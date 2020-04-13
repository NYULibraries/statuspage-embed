const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';

class StatuspageApi {
  async getData() {
    const response = await fetch(statuspageUrl);
    this.data = await response.json();
  }

  firstIncident() {
    return this.data.incidents[0];
  }

  incidentName() {
    return this.firstIncident().name;
  }

  incidentUrl() {
    return this.firstIncident().shortlink;
  }
}

export { StatuspageApi as default };
