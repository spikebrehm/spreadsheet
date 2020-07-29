import React, { useReducer } from 'react';
import Cell from '../components/Cell';
import cellReducer, { getInitialState } from '../reducers/cellReducer';

const SIZE = {
  W: 10,
  H: 10,
};

function times(num: number, fn: (i: number) => JSX.Element) {
  const elements: JSX.Element[] = [];
  for (let i = 0; i < num; i++) {
    elements.push(fn(i));
  }
  return elements;
}

export default function Sheet() {
  const [state, dispatch] = useReducer(
    cellReducer,
    getInitialState(SIZE.W, SIZE.H)
  );

  return (
    <div className="Sheet">
      <input />

      <table>
        <tbody>
          {times(SIZE.W, (rowIndex: number) => (
            <tr key={rowIndex} className="Sheet__row">
              {times(SIZE.H, (colIndex: number) => (
                <Cell
                  key={colIndex}
                  value={state.cells[rowIndex][colIndex].value}
                  state={state}
                  isFocused={
                    state.currentRow === rowIndex &&
                    state.currentCol === colIndex
                  }
                  onFocus={() =>
                    dispatch({ type: 'focus', payload: { rowIndex, colIndex } })
                  }
                  onChange={(value: string) => {
                    dispatch({
                      type: 'update',
                      payload: {
                        rowIndex,
                        colIndex,
                        value,
                      },
                    });
                  }}
                  onNextCell={() => dispatch({ type: 'next_cell' })}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .Sheet table {
          border-collapse: collapse;
        }
      `}</style>
    </div>
  );
}
