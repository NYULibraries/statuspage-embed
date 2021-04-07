import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance|nyureturns)',
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  validIncident() {
    return this.hasMatchingHashtag();
  }

  chosenIncident() {
    const incident = this.areThereIncidents() ? this.data.incidents[0] : false;
    const scheduledMaintenance = this.areThereScheduledMaintenances() ? this.data.scheduled_maintenances[0] : false;
    let selectedIncident = false;

    if (!scheduledMaintenance && incident) selectedIncident = incident;
    if (!selectedIncident && incident) selectedIncident = this.choosePriorityIncident(); 

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
    if(this.chosenIncident()) return !!hashtagRegexp.exec(this.lastUpdate().body);
    return false
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
