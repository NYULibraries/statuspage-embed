import config from './config';

const IMPACT_NONE = 'none';

class Statuspage {
    #alert;
    #data;
    #status;

    alertName() {
        return this.#alert.name;
    }

    alertUrl() {
        return this.#alert.shortlink;
    }

    chosenAlert() {
        const incident = this.#data?.incidents?.[ 0 ];
        const scheduledMaintenance = this.#data?.scheduled_maintenances?.[ 0 ];

        if ( !incident && !scheduledMaintenance ) return false;
        if ( !incident && scheduledMaintenance ) return scheduledMaintenance;
        if ( incident && !scheduledMaintenance ) return incident;

        const incidentUpdatedAt = incident.updated_at.slice( 0, 19 );
        const maintenanceUpdatedAt =
            scheduledMaintenance.updated_at.slice( 0, 19 );

        if ( incidentUpdatedAt === maintenanceUpdatedAt ) return incident;
        return incidentUpdatedAt > maintenanceUpdatedAt ?
            incident :
            scheduledMaintenance;
    }

    async fetchData() {
        const response = await fetch( config.getStatuspageSummaryUrl() );
        this.#data = await response.json();
        this.#alert = this.chosenAlert();
        this.#status = this.#alert.status;
    }

    getData() {
        return this.#data;
    }

    status() {
        return this.#status;
    }

    validAlert() {
        return this.#alert && this.#alert.status !== IMPACT_NONE;
    }
}

export { Statuspage as default };
