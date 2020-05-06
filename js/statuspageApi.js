import config from './config';

const hashtagRegexp = new RegExp('#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)');

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
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

  // true if matches hashtag from regexp above
  hasMatchingHashtag() {
    return !!hashtagRegexp.exec(this.lastUpdate().body);
  }

  // private / protected method
  lastUpdate() {
    return this.lastIncident().incident_updates[0];
  }
}

export { StatuspageApi as default };
