import config from './config';


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

  alertName() {
    return this.chosenAlert().name;
  }

  alertUrl() {
    return this.chosenAlert().shortlink;
  }

  lastStatus() {
    return this.#lastUpdate().status;
  }

  // true if matches hashtag from lists below, which depend on hostname
  hasMatchingHashtag() {
    if (this.chosenAlert()) 
      return !!this.getHashtagRegexp().exec(this.#lastUpdate().body);
    return false;
  }

  // private / protected methods
  getHashtagRegexp() {
    const defaultHashtagArr = ["majoroutage", "weatherclosure", "buildingclosure", "scheduledmaintenance", "nyureturns"];
    const bobcatdevHashtagArr = defaultHashtagArr.concat(["devbobcat"]);
    const bobcatHashtagArr = defaultHashtagArr.concat(["bobcat"]);

    var hashtagArr;
    switch(this.#getCurrentHostname()) {
      case "bobcat.library.nyu.edu":
        hashtagArr = bobcatHashtagArr;
        break;
      case "bobcatdev.library.nyu.edu":
        hashtagArr = bobcatdevHashtagArr;
        break;
      default:
        hashtagArr = defaultHashtagArr;
    }
    return new RegExp("#(" + hashtagArr.join("|") + ")($|[^a-zA-Z0-9_])");
  }

  #getCurrentHostname() {
    return window.location.hostname;
  }

  #lastUpdate() {
    return this.chosenAlert().incident_updates[0];
  }

}

export { StatuspageApi as default };
