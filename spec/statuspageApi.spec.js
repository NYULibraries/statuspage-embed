import StatuspageApi from '../js/statuspageApi';

let statuspageApi;
// Define mock data as function so we can edit incident update body for certain tests
let body = 'Test body #majoroutage';
let scheduledMaintenanceBody = 'Test';
let firstIncidentsDate = '2020-07-15T09:11:40.438-04:00';
let firstMaintenanceDate = '2020-07-15T09:11:40.438-04:00';
const getMockData = () => ({
  incidents: [
    {
      name: 'FirstIncident',
      shortlink: 'http://example.com/1',
      updated_at: firstIncidentsDate,
      incident_updates: [
        { body, status: 'identified' },
        { body: 'Fake body', status: 'monitoring' },
      ],
    },
    {
      name: 'SecondIncident ',
      shortlink: 'http://example.com/2',
      updated_at: '2019-07-01T09:11:40.438-04:00',
      incident_updates: [
        { body: 'Another fake body', status: 'investigating' },
        { body: 'Fake body', status: 'monitoring' },
      ],
    },
  ],
  scheduled_maintenances: [
    {
      name: 'FirstMaintenance',
      shortlink: 'http://example.com/1',
      updated_at: firstMaintenanceDate,
      incident_updates: [
        { body: scheduledMaintenanceBody, status: 'in_progress' },
        { body: 'Fake body', status: 'identified' },
      ],
    },
    {
      name: 'SecondMaintenance',
      shortlink: 'http://example.com/2',
      updated_at: '2019-07-01T09:11:40.438-04:00',
      incident_updates: [
        { body: 'Another fake body', status: 'scheduled' },
        { body: 'Fake body', status: 'monitoring' },
      ],
    },
  ],
});

beforeEach(() => {
  statuspageApi = new StatuspageApi();
});

describe('#getData', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {};
    global.fetch = jest.fn(() => mockResponse);
    mockResponse.json = jest.fn(() => getMockData());
  });

  it('assign json data from fetch', async () => {
    await statuspageApi.getData();
    expect(global.fetch).toHaveBeenCalled();
    expect(statuspageApi.data).toEqual(getMockData());
  });
});

describe('#chosenAlert', () => {
  it('should return false if no active incidents', () => {
    statuspageApi.data = { incidents: [] };
    expect(statuspageApi.chosenAlert()).toEqual(false);
  });

  it('should return last incident, if populated', () => {
    statuspageApi.data = getMockData();
    expect(statuspageApi.chosenAlert()).toEqual(getMockData().incidents[0]);
  });

  it('should return false if no scheduled maintenances', () => {
    statuspageApi.data = { scheduled_maintenances: [] };
    expect(statuspageApi.chosenAlert()).toEqual(false);
  });

  it('should return last scheduled maintenance, if populated', () => {
    statuspageApi.data = {
      scheduled_maintenances: [
        {
          name: 'FirstMaintenance',
          shortlink: 'http://example.com/1',
          updated_at: firstMaintenanceDate,
          incident_updates: [
            { body: scheduledMaintenanceBody, status: 'in_progress' },
            { body: 'Fake body', status: 'identified' },
          ],
        },
        {
          name: 'SecondMaintenance',
          shortlink: 'http://example.com/2',
          updated_at: '2019-07-01T09:11:40.438-04:00',
          incident_updates: [
            { body: 'Another fake body', status: 'scheduled' },
            { body: 'Fake body', status: 'monitoring' },
          ],
        },
      ],
    };
    expect(statuspageApi.chosenAlert()).toEqual(statuspageApi.data.scheduled_maintenances[0]);
  });

  it('should return the incident with higher priority', () => {
    statuspageApi.data = {
      incidents: [
        {
          name: 'FirstIncident',
          shortlink: 'http://example.com/1',
          updated_at: '2020-07-15T09:11:40.438-04:00',
          incident_updates: [
            { body: 'Another fake body', status: 'investigating' },
            { body: 'Fake body', status: 'resolved' },
          ],
        },
      ],
      scheduled_maintenances: [
        {
          name: 'FirstMaintenance',
          shortlink: 'http://example.com/1',
          updated_at: '2020-07-15T09:11:40.438-04:00',
          incident_updates: [
            { body: scheduledMaintenanceBody, status: 'in_progress' },
            { body: 'Fake body', status: 'identified' },
          ],
        },
      ],
    };

    let expected = statuspageApi.data.incidents[0]
    expect(statuspageApi.chosenAlert()).toEqual(expected);
  });

});


describe('#alertName', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last alert name', () => {
    expect(statuspageApi.alertName()).toEqual('FirstIncident');
  });
});

describe('#alertUrl', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident name', () => {
    expect(statuspageApi.alertUrl()).toEqual('http://example.com/1');
  });
});

describe('#lastStatus', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last status', () => {
    expect(statuspageApi.lastStatus()).toEqual('identified');
  });
});

describe('#hasMatchingHashtag', () => {
  describe('with matching hashtag in body', () => {
    beforeEach(() => {
      statuspageApi.data = getMockData();
    });

    it('should return truthy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeTruthy();
    });
  });

  describe('with non-matching hashtag in body', () => {
    beforeEach(() => {
      body = 'Some other #hashtag';
      statuspageApi.data = getMockData();
    });

    it('should return falsy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });

  describe('with no hashtag in body', () => {
    beforeEach(() => {
      body = 'Some body';
      statuspageApi.data = getMockData();
    });

    it('should return falsy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });

  describe('with no body', () => {
    beforeEach(() => {
      body = null;
      statuspageApi.data = getMockData();
    });

    it('should return falsy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });
});

describe('#choosePriorityAlert', () => {
  describe('prioritizes whichever is the most recent incident', () => {
    beforeEach(() => {
      firstMaintenanceDate = '2020-07-20T09:11:40.438-04:00';
      scheduledMaintenanceBody = '#scheduledmaintenance';
      statuspageApi.data = getMockData();
    });

    it('should return the most recent alert, regardless of type', () => {
      const test = statuspageApi.choosePriorityAlert();
      expect(test.name).toEqual('FirstMaintenance');
    });
  });

  describe('if two alerts occur at the same time, prioritize incidents', () => {
    beforeEach(() => {
      firstIncidentsDate = '2020-07-20T09:11:40.438-04:00';
      firstMaintenanceDate = '2020-07-20T09:11:40.438-04:00';
      scheduledMaintenanceBody = '#scheduledmaintenance';
      statuspageApi.data = getMockData();
    });

    it('should return incidents instead of scheduled maintenance', () => {
      expect(statuspageApi.choosePriorityAlert().name).toEqual('FirstIncident');
    });
  });
});

describe('#areThereIncidents', () => {
  it('should return false if incidents array is not present', () => {
    statuspageApi.data = {};
    expect(statuspageApi.areThereIncidents()).toEqual(false);
  });

  it('should return false if incidents array is empty', () => {
    statuspageApi.data = { incidents: [] };
    expect(statuspageApi.areThereIncidents()).toEqual(false);
  });
});

describe('#areThereScheduledMaintenances', () => {
  beforeEach(() => {
    statuspageApi.data = {
      incidents: [
        {
          name: 'FirstIncident',
          shortlink: 'http://example.com/1',
          updated_at: '2020-07-20T09:11:40.438-04:00',
          incident_updates: [
            { body, status: 'identified' },
            { body: 'Fake body', status: 'monitoring' },
          ],
        },
      ],
    };
  });

  it('should return false when there are no scheduled maintenances', () => {
    expect(statuspageApi.areThereScheduledMaintenances()).toBeFalsy();
  });
});

describe('Test the private method lastUpdate', () => {
  test('Should throw an error when trying to call the private method lastUpdate', () => {
    const statusPage = new StatuspageApi();
    expect(() => {
      statusPage.lastUpdate();
    }).toThrow("statusPage.lastUpdate is not a function");
  });
});
