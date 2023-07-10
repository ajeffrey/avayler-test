import '@testing-library/jest-dom'
import { formatISO } from 'date-fns'
import { render, screen, waitFor } from '@testing-library/react'
import { faker } from '@faker-js/faker';
import { getSpacexData } from '../lib/getSpacexData';
import * as Types from '../types';
import { QUERY_CORES_URL, QUERY_LAUNCHES_URL, QUERY_PAYLOADS_URL } from '../constants';
import Home from '.'

jest.mock('../lib/getSpacexData', () => ({
  getSpacexData: jest.fn(),
}));

function makeFakeData() {
  const launches: Types.Launch[] = [];
  const cores: Types.Core[] = [];
  const payloads: Types.Payload[] = [];

  for(let i = 0; i < 10; i++) {
    const launch: Types.Launch = {
      id: faker.string.uuid(),
      success: faker.datatype.boolean(),
      name: `${faker.science.chemicalElement().name} ${faker.system.semver()}`,
      date_utc: formatISO(faker.date.past()),
      cores: [],
      payloads: [],
      failures: [],
      links: {
        patch: {
          small: faker.image.avatar(),
        }
      }
    };

    launches.push(launch);

    if(faker.datatype.boolean()) {
      launch.failures.push({
        time: faker.number.int(1000),
        altitude: faker.datatype.boolean() ? faker.number.int(100000) : undefined,
        reason: faker.word.words(faker.number.int({ min: 5, max: 15 })),
      });
    }

    const numCores = faker.number.int(3);
    for(let i = 0; i < numCores; i++) {
      const core: Types.Core = {
        id: faker.string.uuid(),
        serial: faker.string.nanoid(),
      };

      cores.push(core);
      launch.cores.push({ core: core.id });
    }

    const numPayloads = faker.number.int({ min: 1, max: 5 });
    for(let i = 0; i < numPayloads; i++) {
      const payload: Types.Payload = {
        id: faker.string.uuid(),
        type: faker.word.noun()
      };

      launch.payloads.push(payload.id);
      payloads.push(payload);
    }
  }

  return { launches, cores, payloads };
}

let fakeData: any;
describe('Homepage', () => {
  beforeEach(() => {
    fakeData = makeFakeData();
    jest.clearAllMocks();
  });

  it('renders the page successfully', async () => {
    (getSpacexData as jest.Mock).mockImplementation((url) => {
      switch(url) {
        case QUERY_LAUNCHES_URL: return Promise.resolve({ docs: fakeData.launches });
        case QUERY_CORES_URL: return Promise.resolve({ docs: fakeData.cores });
        case QUERY_PAYLOADS_URL: return Promise.resolve({ docs: fakeData.payloads });
      }
    });

    render(<Home />);
    expect(screen.getByTestId('loading')).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId('launches')).toBeInTheDocument, { timeout: 10000 });
    screen.debug();
    const launches = screen.getAllByTestId('launch');
    expect(launches.length).toBe(10);
  })
});