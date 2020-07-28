import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)',
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  mostRecentIncident() {
    const incidents = this.data.incidents[0];
    const scheduledMaintenances = this.doesScheduledMaintenanceMatchHashtag();
    let chosenIncident;

    // if scheduled_maintenances has a relevant hashtag, add to the scheduledMaintenances variable
    // if not, the chosenIncident is automatically incidents
    if (!scheduledMaintenances) chosenIncident = incidents;

    if (chosenIncident === undefined) chosenIncident = this.compareTime();

    return chosenIncident;
  }

  incidentName() {
    return this.mostRecentIncident().name;
  }

  incidentUrl() {
    return this.mostRecentIncident().shortlink;
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

  compareTime() {
    const incidentUpdatedAt = this.data.incidents[0].updated_at.slice(0, 19);
    const maintenanceUpdatedAt = this.data.scheduled_maintenances[0].updated_at.slice(0, 19);

    // check if they were updated at the same time
    if (incidentUpdatedAt === maintenanceUpdatedAt) {
      return this.data.incidents[0];
    }
    return this.mostRecent(incidentUpdatedAt, maintenanceUpdatedAt);
  }

  mostRecent(incident, maintenance) {
    if (incident > maintenance) return this.data.incidents[0];
    return this.data.scheduled_maintenances[0];
  }

  // private / protected method
  lastUpdate() {
    return this.mostRecentIncident().incident_updates[0];
  }
}

export { StatuspageApi as default };
