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

describe('#mostRecentIncident', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident', () => {
    expect(statuspageApi.mostRecentIncident()).toEqual(getMockData().incidents[0]);
  });
});

describe('#incidentName', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident name', () => {
    expect(statuspageApi.incidentName()).toEqual('FirstIncident');
  });
});

describe('#incidentUrl', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident name', () => {
    expect(statuspageApi.incidentUrl()).toEqual('http://example.com/1');
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

describe('#doesScheduledMaintenanceMatchHashtag', () => {
  describe('with no hashtag in body', () => {
    beforeEach(() => {
      statuspageApi.data = getMockData();
    });

    it('should return falsy', () => {
      expect(statuspageApi.doesScheduledMaintenanceMatchHashtag()).toBeFalsy();
    });
  });

  describe('with matching hashtag in body', () => {
    beforeEach(() => {
      scheduledMaintenanceBody = '#scheduledmaintenance';
      statuspageApi.data = getMockData();
    });

    it('should return truthy', () => {
      expect(statuspageApi.doesScheduledMaintenanceMatchHashtag()).toBeTruthy();
    });
  });
});

describe('#compareTime', () => {
  describe('prioritizes whichever is the most recent incident', () => {
    beforeEach(() => {
      firstMaintenanceDate = '2020-07-20T09:11:40.438-04:00';
      scheduledMaintenanceBody = '#scheduledmaintenance';
      statuspageApi.data = getMockData();
    });

    it('should return the most recent alert, regardless of type', () => {
      const test = statuspageApi.compareTime();
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
      expect(statuspageApi.compareTime().name).toEqual('FirstIncident');
    });
  });
});
