import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance|nyureturns)',
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  validAlert() {
    return this.hasMatchingHashtag();
  }

  chosenAlert() {
    const incident = this.areThereIncidents() ? this.data.incidents[0] : false;
    const scheduledMaintenance = this.areThereScheduledMaintenances() ? this.data.scheduled_maintenances[0] : false;
    let selectedAlert = false;

    if (scheduledMaintenance && !incident) selectedAlert = scheduledMaintenance;
    if (!scheduledMaintenance && incident) selectedAlert = incident;
    if (scheduledMaintenance && incident) selectedAlert = this.choosePriorityAlert(scheduledMaintenance, incident);
      

    return selectedAlert;
  }

  alertName() {
    return this.chosenAlert().name;
  }

  alertUrl() {
    return this.chosenAlert().shortlink;
  }

  lastStatus() {
    return this.lastUpdate().status;
  }

  // true if matches hashtag from regexp above
  hasMatchingHashtag() {
    if(this.chosenAlert()) return !!hashtagRegexp.exec(this.lastUpdate().body);
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

  choosePriorityAlert() {
    const incidentUpdatedAt = this.data.incidents[0].updated_at.slice(0, 19);
    const maintenanceUpdatedAt = this.data.scheduled_maintenances[0].updated_at.slice(0, 19);

    // check if they were updated at the same time
    if (incidentUpdatedAt === maintenanceUpdatedAt) {
      return this.data.incidents[0];
    }
    return this.chooseRecentAlert(incidentUpdatedAt, maintenanceUpdatedAt);
  }

  chooseRecentAlert(incident, maintenance) {
    if (incident > maintenance) return this.data.incidents[0];
    return this.data.scheduled_maintenances[0];
  }

  // private / protected method
  lastUpdate() {
    return this.chosenAlert().incident_updates[0];
  }
}

export { StatuspageApi as default };
