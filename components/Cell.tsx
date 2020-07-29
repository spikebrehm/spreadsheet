import React, { useEffect, useRef } from 'react';
import { CellState } from '../reducers/cellReducer';

type Props = {
  value: string;
  state: CellState;
  isFocused: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onNextCell: () => void;
};

interface Formatter {
  regexp: RegExp;
  format: (value: string, state: CellState) => string;
}

const formatters: Formatter[] = [
  {
    regexp: /^=[A-Z][\d]$/,
    format: (value, state) => {
      const col = Number(value[2]) - 1;
      const row = value.charCodeAt(1) - 65;
      return state.cells[col][row].value;
    },
  },
  {
    regexp: /^=.+/,
    format: (value) => {
      try {
        return String(eval(value.slice(1)));
      } catch (e) {
        console.error(e);
        return '#ERROR';
      }
    },
  },
];

function formatValue(value: string, state: CellState) {
  let formattedValue = value;
  while (formattedValue[0] === '=') {
    const formatter = formatters.find((f) => f.regexp.test(formattedValue));
    if (formatter) {
      formattedValue = formatter.format(formattedValue, state);
    }
  }
  return formattedValue;
}

export default function Cell({
  value,
  state,
  isFocused,
  onFocus,
  onChange,
  onNextCell,
}: Props) {
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [isFocused]);

  return (
    <td>
      <input
        ref={inputRef}
        value={isFocused ? value : formatValue(value, state)}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyPress={(e) => {
          if (e.which === 13) {
            onNextCell();
          }
        }}
      />
      <style jsx>{`
        td {
          border: 1px solid #aaa;
          width: 100px;
        }
        input {
          width: 100%;
          padding: 8px;
          border: none;
        }
      `}</style>
    </td>
  );
}
