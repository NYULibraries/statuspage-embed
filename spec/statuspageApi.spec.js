import StatuspageApi from '../js/statuspageApi';

let statuspageApi;
const mockData = { incidents: [{ name: 'First', shortlink: 'http://example.com/1' }, { name: 'Second', shortlink: 'http://example.com/2' }] };

beforeEach(() => {
  statuspageApi = new StatuspageApi();
});

describe('#getData', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {};
    global.fetch = jest.fn(() => mockResponse);
    mockResponse.json = jest.fn(() => mockData);
  });

  it('assign json data from fetch', async () => {
    await statuspageApi.getData();
    expect(global.fetch).toHaveBeenCalled();
    expect(statuspageApi.data).toEqual(mockData);
  });
});

describe('#firstIncident', () => {
  beforeEach(() => {
    statuspageApi.data = mockData;
  });

  it('should return first incident', () => {
    expect(statuspageApi.firstIncident()).toEqual(mockData.incidents[0]);
  });
});

describe('#incidentName', () => {
  beforeEach(() => {
    statuspageApi.data = mockData;
  });

  it('should return first incident name', () => {
    expect(statuspageApi.incidentName()).toEqual('First');
  });
});

describe('#incidentUrl', () => {
  beforeEach(() => {
    statuspageApi.data = mockData;
  });

  it('should return first incident name', () => {
    expect(statuspageApi.incidentUrl()).toEqual('http://example.com/1');
  });
});
