import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Launch } from "./Launch";
import * as Types from '../types';

const launch: Types.Launch = {
  id: '123',
  name: 'Test Launch',
  date_utc: '2022-08-31T05:40:00.000Z',
  cores: [{ core: 'CORE1' }],
  payloads: ['PAYLOAD1', 'PAYLOAD2'],
  success: true,
  failures: [{ time: 145, altitude: 1000, reason: 'it broke' }],
  links: {
    patch: {
      small: 'http://placekitten.com/200/200'
    }
  }
};

const core: Types.Core = {
  id: 'CORE1',
  serial: 'B1234',
};

const payload1: Types.Payload = {
  id: 'PAYLOAD1',
  type: 'Satellite',
};

const payload2: Types.Payload = {
  id: 'PAYLOAD2',
  type: "Elon's Car"
};

const payloads = [payload1, payload2];

describe('<Launch />', () => {
  it('renders correctly', () => {
    render(<Launch {...{ launch, core, payloads }} />);
    expect(screen.getByTestId('name').textContent).toEqual(`✅ ${launch.name}`);
    expect((screen.getByTestId('image') as HTMLImageElement).src).toEqual(launch.links.patch.small);
    expect(screen.getByTestId('date').textContent).toEqual('31st Aug 2022 @ 6:40am');
    expect(screen.getByTestId('core').textContent).toEqual('Primary Core: B1234');
    const payloadEls = screen.getAllByTestId('payload');
    expect(payloadEls.length).toBe(2);
    expect(payloadEls[0].textContent).toEqual('PAYLOAD1 (Satellite)');
    expect(payloadEls[1].textContent).toEqual(`PAYLOAD2 (Elon's Car)`);
    const failureEls = screen.getAllByTestId('failure');
    expect(failureEls.length).toBe(1);
    expect(failureEls[0].textContent).toEqual('T+2M25S@1000ft: it broke')
  });
});