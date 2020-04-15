const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';
const hashtagRegexp = new RegExp('#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)');

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

  lastStatus() {
    return this.lastUpdate().status;
  }

  hasMatchingHashtag() {
    return !!hashtagRegexp.exec(this.lastUpdate().body);
  }

  lastUpdate() {
    return this.firstIncident().incident_updates[0];
  }
}

export { StatuspageApi as default };
