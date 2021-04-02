import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance|nyureturns)',
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  chosenIncident() {
    const incidents = this.areThereIncidents() ? this.data.incidents[0] : null
    let scheduledMaintenances;
    let selectedIncident;

    if (this.areThereScheduledMaintenances()) scheduledMaintenances = this.doesScheduledMaintenanceMatchHashtag();
    if (!scheduledMaintenances && incidents) selectedIncident = incidents;
    if (selectedIncident === undefined && incidents) selectedIncident = this.choosePriorityIncident();

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

  areThereIncidents() {
    const incidentsList = this.data?.incidents ? this.data.incidents : null;
    const incident = incidentsList?.length ? incidentsList[0] : null
    if (incident) return true
    return false
  }

  areThereScheduledMaintenances() {
    if (this.data.scheduled_maintenances && this.data.scheduled_maintenances.length) return true;
    return false;
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
