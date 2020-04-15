import StatuspageApi from '../js/statuspageApi';

let statuspageApi;
// Define mock data as function so we can edit incident update body for certain tests
let body = 'Test body #majoroutage';
const getMockData = () => ({
  incidents: [
    {
      name: 'First',
      shortlink: 'http://example.com/1',
      incident_updates: [
        { body, status: 'identified' },
        { body: 'Fake body', status: 'monitoring' },
      ],
    },
    {
      name: 'Second',
      shortlink: 'http://example.com/2',
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

describe('#lastIncident', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident', () => {
    expect(statuspageApi.lastIncident()).toEqual(getMockData().incidents[0]);
  });
});

describe('#incidentName', () => {
  beforeEach(() => {
    statuspageApi.data = getMockData();
  });

  it('should return last incident name', () => {
    expect(statuspageApi.incidentName()).toEqual('First');
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

    it('should return truthy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });

  describe('with no hashtag in body', () => {
    beforeEach(() => {
      body = 'Some body';
      statuspageApi.data = getMockData();
    });

    it('should return truthy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });

  describe('with no body', () => {
    beforeEach(() => {
      body = null;
      statuspageApi.data = getMockData();
    });

    it('should return truthy', () => {
      expect(statuspageApi.hasMatchingHashtag()).toBeFalsy();
    });
  });
});
