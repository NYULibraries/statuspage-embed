import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)',
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  chosenIncident() {
    const incidents = this.data.incidents[0];
    const scheduledMaintenances = this.doesScheduledMaintenanceMatchHashtag();
    let selectedIncident;

    if (!scheduledMaintenances) selectedIncident = incidents;

    if (selectedIncident === undefined) selectedIncident = this.choosePriorityIncident();

    return selectedIncident;
  }

  incidentName() {
    return this.chosenIncident().name;
  }

  incidentUrl() {
    return this.chosenIncident().shortlink;
  }

  lastStatus() {
    return this.lastUpdate().status;
  }

  // true if matches hashtag from regexp above
  hasMatchingHashtag() {
    return !!hashtagRegexp.exec(this.lastUpdate().body);
  }

  doesScheduledMaintenanceMatchHashtag() {
    if (hashtagRegexp.test(this.data.scheduled_maintenances[0].incident_updates[0].body)) {
      return this.data.scheduled_maintenances[0];
    }
    return false;
  }

  choosePriorityIncident() {
    const incidentUpdatedAt = this.data.incidents[0].updated_at.slice(0, 19);
    const maintenanceUpdatedAt = this.data.scheduled_maintenances[0].updated_at.slice(0, 19);

    // check if they were updated at the same time
    if (incidentUpdatedAt === maintenanceUpdatedAt) {
      return this.data.incidents[0];
    }
    return this.chooseRecentIncident(incidentUpdatedAt, maintenanceUpdatedAt);
  }

  chooseRecentIncident(incident, maintenance) {
    if (incident > maintenance) return this.data.incidents[0];
    return this.data.scheduled_maintenances[0];
  }

  // private / protected method
  lastUpdate() {
    return this.chosenIncident().incident_updates[0];
  }
}

export { StatuspageApi as default };
