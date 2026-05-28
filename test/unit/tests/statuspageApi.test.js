import { beforeEach, describe, expect, it, test, vi } from 'vitest';

import StatuspageApi from '../../../src/js/statuspageApi';

let statuspageApi;
// Define mock data as function so we can edit incident update body for certain tests
let body = 'Test body #majoroutage';
const scheduledMaintenanceBody = 'Test';
const firstIncidentsDate = '2020-07-15T09:11:40.438-04:00';
const firstMaintenanceDate = '2020-07-15T09:11:40.438-04:00';
const mockData = {
    incidents: [
        {
            name            : 'FirstIncident',
            shortlink       : 'http://example.com/1',
            updated_at      : firstIncidentsDate,
            status          : 'identified',
            incident_updates: [
                { body, status: 'identified' },
                { body: 'Fake body', status: 'monitoring' },
            ],
        },
        {
            name            : 'SecondIncident ',
            shortlink       : 'http://example.com/2',
            updated_at      : '2019-07-01T09:11:40.438-04:00',
            status          : 'investigating',
            incident_updates: [
                { body: 'Another fake body', status: 'investigating' },
                { body: 'Fake body', status: 'monitoring' },
            ],
        },
    ],
    scheduled_maintenances: [
        {
            name            : 'FirstMaintenance',
            shortlink       : 'http://example.com/1',
            updated_at      : firstMaintenanceDate,
            status          : 'in_progress',
            incident_updates: [
                { body: scheduledMaintenanceBody, status: 'in_progress' },
                { body: 'Fake body', status: 'identified' },
            ],
        },
        {
            name            : 'SecondMaintenance',
            shortlink       : 'http://example.com/2',
            updated_at      : '2019-07-01T09:11:40.438-04:00',
            status          : 'scheduled',
            incident_updates: [
                { body: 'Another fake body', status: 'scheduled' },
                { body: 'Fake body', status: 'monitoring' },
            ],
        },
    ],
};

beforeEach( () => {
    statuspageApi = new StatuspageApi();
} );

describe( 'fetchData', () => {
    beforeEach( () => {
        // Prevent error "TypeError: Invalid URL".
        document.currentScript.src = 'https://does-not-matter.com';

        mockResponse( mockData );
    } );

    it( 'sets `data` field to correct value', async () => {
        await statuspageApi.fetchData();

        expect( global.fetch ).toHaveBeenCalled();
        expect( statuspageApi.getData() ).toEqual( mockData );
    } );

    describe( 'sets `#alert` field to correct value', async () => {
        it( 'alertName() should return the name of the chosen alert', async () => {
            await statuspageApi.fetchData();

            expect( statuspageApi.alertName() ).toEqual( 'FirstIncident' );
        } );

        it( 'alertUrl() should return the URL of the chosen alert', async () => {
            await statuspageApi.fetchData();

            expect( statuspageApi.alertUrl() ).toEqual( 'http://example.com/1' );
        } );
    } );

    describe( 'sets `#status` field to correct value', async () => {
        it( 'status() should return the status of the chosen alert', async () => {
            await statuspageApi.fetchData();

            expect( statuspageApi.status() ).toEqual( 'identified' );
        } );
    } );
} );

describe( 'chosenAlert', () => {
    beforeEach( () => {
        // Prevent error "TypeError: Invalid URL".
        document.currentScript.src = 'https://does-not-matter.com';
    } );

    it( 'should return false if no active incidents', async () => {
        mockResponse( { incidents: [] } );

        await statuspageApi.fetchData();

        expect( statuspageApi.chosenAlert() ).toEqual( false );
    } );

    it( 'should return last incident, if populated', async () => {
        mockResponse( mockData );

        await statuspageApi.fetchData();

        expect( statuspageApi.chosenAlert() ).toEqual( mockData.incidents[ 0 ] );
    } );

    it( 'should return false if no scheduled maintenances', async () => {
        mockResponse( { scheduled_maintenances: [] } );

        await statuspageApi.fetchData();

        expect( statuspageApi.chosenAlert() ).toEqual( false );
    } );

    it( 'should return last scheduled maintenance, if populated', async () => {
        mockResponse( {
            scheduled_maintenances: [
                {
                    name            : 'FirstMaintenance',
                    shortlink       : 'http://example.com/1',
                    updated_at      : firstMaintenanceDate,
                    incident_updates: [
                        { body: scheduledMaintenanceBody, status: 'in_progress' },
                        { body: 'Fake body', status: 'identified' },
                    ],
                },
                {
                    name            : 'SecondMaintenance',
                    shortlink       : 'http://example.com/2',
                    updated_at      : '2019-07-01T09:11:40.438-04:00',
                    incident_updates: [
                        { body: 'Another fake body', status: 'scheduled' },
                        { body: 'Fake body', status: 'monitoring' },
                    ],
                },
            ],
        } );

        await statuspageApi.fetchData();

        expect( statuspageApi.chosenAlert() ).toEqual( statuspageApi.getData().scheduled_maintenances[ 0 ] );
    } );

    it( 'should return the incident with higher priority', async () => {
        mockResponse( {
            incidents: [
                {
                    name            : 'FirstIncident',
                    shortlink       : 'http://example.com/1',
                    updated_at      : '2020-07-15T09:11:40.438-04:00',
                    incident_updates: [
                        { body: 'Another fake body', status: 'investigating' },
                        { body: 'Fake body', status: 'resolved' },
                    ],
                },
            ],
            scheduled_maintenances: [
                {
                    name            : 'FirstMaintenance',
                    shortlink       : 'http://example.com/1',
                    updated_at      : '2020-07-15T09:11:40.438-04:00',
                    incident_updates: [
                        { body: scheduledMaintenanceBody, status: 'in_progress' },
                        { body: 'Fake body', status: 'identified' },
                    ],
                },
            ],
        } );

        await statuspageApi.fetchData();

        const expected = statuspageApi.getData().incidents[ 0 ];
        expect( statuspageApi.chosenAlert() ).toEqual( expected );
    } );
} );

function mockResponse( responseJson ) {
    const mockResponse = {};
    global.fetch = vi.fn( () => mockResponse );

    // Defensive clone
    const responseJsonClone = { ...responseJson };
    mockResponse.json = vi.fn( () => responseJsonClone );
}
