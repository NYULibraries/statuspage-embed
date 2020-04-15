const statuspageUrl = 'https://kyyfz4489y7m.statuspage.io/api/v2/summary.json';
const hashtagRegexp = new RegExp('#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)');

class StatuspageApi {
  async getData() {
    const response = await fetch(statuspageUrl);
    this.data = await response.json();
  }

  lastIncident() {
    return this.data.incidents[0];
  }

  incidentName() {
    return this.lastIncident().name;
  }

  incidentUrl() {
    return this.lastIncident().shortlink;
  }

  lastStatus() {
    return this.lastUpdate().status;
  }

  hasMatchingHashtag() {
    return !!hashtagRegexp.exec(this.lastUpdate().body);
  }

  lastUpdate() {
    return this.lastIncident().incident_updates[0];
  }
}

export { StatuspageApi as default };
