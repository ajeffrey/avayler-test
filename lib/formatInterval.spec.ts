import { formatInterval } from "./formatInterval";

describe('formatInterval()', () => {
  test('+-seconds', () => {
    expect(formatInterval(10)).toEqual('T+10S');
    expect(formatInterval(2)).toEqual('T+2S');
    expect(formatInterval(-59)).toEqual('T-59S');
  });
  test('+-minutes', () => {
    expect(formatInterval(61)).toEqual('T+1M1S');
    expect(formatInterval(-1405)).toEqual('T-23M25S');
    expect(formatInterval(180)).toEqual('T+3M');
  });
  test('+-hours', () => {
    expect(formatInterval(23503)).toEqual('T+6H31M43S');
    expect(formatInterval(-31380)).toEqual('T-8H43M');
    expect(formatInterval(54000)).toEqual('T+15H');
  });
});