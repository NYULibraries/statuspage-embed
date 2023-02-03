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
    const incident = this.data?.incidents?.[0];
    const scheduledMaintenance = this.data?.scheduled_maintenances?.[0];

    if (!incident && !scheduledMaintenance) return false;
    if (!incident && scheduledMaintenance) return scheduledMaintenance;
    if (incident && !scheduledMaintenance) return incident;

    const incidentUpdatedAt = incident.updated_at.slice(0, 19);
    const maintenanceUpdatedAt = scheduledMaintenance.updated_at.slice(0, 19);

    if (incidentUpdatedAt === maintenanceUpdatedAt) return incident;
    return incidentUpdatedAt > maintenanceUpdatedAt ? incident : scheduledMaintenance;
  }

  // private / protected method
  #lastUpdate() {
    return this.chosenAlert().incident_updates[0];
  }

  alertName() {
    return this.chosenAlert().name;
  }

  alertUrl() {
    return this.chosenAlert().shortlink;
  }

  lastStatus() {
    return this.#lastUpdate().status;
  }

  // true if matches hashtag from regexp above
  hasMatchingHashtag() {
    if (this.chosenAlert()) return !!hashtagRegexp.exec(this.#lastUpdate().body);
    return false;
  }
}

export { StatuspageApi as default };
