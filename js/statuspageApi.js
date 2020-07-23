import config from './config';

const hashtagRegexp = new RegExp(
  '#(majoroutage|weatherclosure|buildingclosure|scheduledmaintenance)'
);

class StatuspageApi {
  async getData() {
    const response = await fetch(config.statuspageUrl);
    this.data = await response.json();
  }

  lastIncident() {
    let chosenIncident = undefined;
    let incidents = this.data.incidents[0];
    let scheduledMaintenances;
    let incidentUpdated;
    let maintenanceUpdated;

    // if scheduled_maintenances has a relevant hashtag, add to the scheduledMaintenances variable
    // if not, the chosenIncident is automatically incidents
    if (
      this.data.scheduled_maintenances === undefined ||
      !hashtagRegexp.test(
        this.data.scheduled_maintenances[0].incident_updates[0].body
      )
    ) {
      chosenIncident = incidents;
    } else {
      scheduledMaintenances = this.data.scheduled_maintenances[0];
    }

    if (chosenIncident === undefined) {
      incidentUpdated = incidents.updated_at.slice(0,19)
      maintenanceUpdated = scheduledMaintenances.updated_at.slice(0,19)

      // check if they were updated at the same time
      if (incidentUpdated === maintenanceUpdated) {
        chosenIncident = incidents;
      } else {
        // else, check which one was the most recent
        incidents.updated_at < scheduledMaintenances.updated_at
          ? (chosenIncident = scheduledMaintenances)
          : (chosenIncident = incidents);
      }
    }
    return chosenIncident;
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
