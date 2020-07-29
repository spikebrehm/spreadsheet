type Cell = {
  value: string;
};

export type CellState = {
  cells: Cell[][];
  currentRow: number;
  currentCol: number;
};

interface Action<T = any> {
  type: string;
  payload?: T;
}

export default function cellReducer(state: CellState, action: Action) {
  switch (action.type) {
    case 'update': {
      const { rowIndex, colIndex, value } = action.payload;
      const row = state.cells[rowIndex];
      const newRow = [
        ...row.slice(0, colIndex),
        { ...row[colIndex], value },
        ...row.slice(colIndex + 1),
      ];
      const cells = [
        ...state.cells.slice(0, rowIndex),
        newRow,
        ...state.cells.slice(rowIndex + 1),
      ];
      return { ...state, cells };
    }
    case 'focus': {
      const { rowIndex, colIndex } = action.payload;
      return {
        ...state,
        currentRow: rowIndex,
        currentCol: colIndex,
      };
    }
    case 'next_cell': {
      debugger;
      return {
        ...state,
        currentRow: state.currentRow + 1,
      };
    }
    default:
      throw new Error();
  }
}

export function getInitialState(rows: number, cols: number): CellState {
  const cells = new Array(rows).fill(undefined).map((el) =>
    new Array(cols).fill({
      value: '',
    })
  );
  return {
    cells,
    currentRow: 0,
    currentCol: 0,
  };
}
