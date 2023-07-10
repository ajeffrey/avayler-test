import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { useIndex } from "./useIndex";

interface Props {
  data: { id: string, name: string }[];
}

function UseIndexTestComponent({ data }: Props) {
  const idx = useIndex(data, 'id');
  return <div data-testid="json">{JSON.stringify(idx)}</div>
}

describe('useIndex()', () => {
  it('indexes lists of objects by the named key', () => {
    const data = [
      { id: 'a', name: 'Aaron' },
      { id: 'b', name: 'Brad' },
      { id: 'c', name: 'Clark' },
    ];

    render(<UseIndexTestComponent data={data} />);
    const json = screen.getByTestId('json').textContent;
    expect(json).toBeTruthy();
    expect(JSON.parse(json as string)).toEqual({
      a: { id: 'a', name: 'Aaron' },
      b: { id : 'b', name: 'Brad' },
      c: { id: 'c', name: 'Clark' },
    })
  });
});