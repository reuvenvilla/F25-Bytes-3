import { useMemo, useState } from "react";
import "./App.css";

// --- Constants ---
const COLS = 6; // width
const ROWS = 7; // height
const RED = "R";
const YELLOW = "Y";

// --- Helpers (single-purpose) ---
function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function isColumnFull(board, col) {
  return board[0][col] !== null;
}

function getLowestEmptyRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) return r;
  }
  return -1;
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

// --- UI Subcomponents (single file for simplicity) ---
function ColumnButtons({ cols, onDrop, isDisabled }) {
  return (
    <div className="columns">
      {Array.from({ length: cols }).map((_, col) => (
        <button
          key={col}
          className="colBtn"
          onClick={() => onDrop(col)}
          disabled={isDisabled(col)}
          title={`Drop in column ${col + 1}`}
        >
          ▼ {col + 1}
        </button>
      ))}
    </div>
  );
}

function Cell({ value }) {
  // value: null | "R" | "Y"
  const className =
    value === RED ? "hole piece-red" : value === YELLOW ? "hole piece-yellow" : "hole";
  return <div className={className} aria-label={value ?? "empty"} />;
}

function Grid({ board }) {
  return (
    <div className="grid" role="grid" aria-label="Connect Four board">
      {board.map((row, r) =>
        row.map((cell, c) => <Cell key={`${r}-${c}`} value={cell} />)
      )}
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [current, setCurrent] = useState(RED); // alternate between R and Y

  const isDropDisabled = (col) => isColumnFull(board, col);

  function handleDrop(col) {
    if (isColumnFull(board, col)) return;
    const row = getLowestEmptyRow(board, col);
    if (row === -1) return;

    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = current;
      return next;
    });
    setCurrent((p) => (p === RED ? YELLOW : RED));
  }

  function handleReset() {
    setBoard(createEmptyBoard());
    setCurrent(RED);
  }

  const statusText = useMemo(
    () => `Turn: ${current === RED ? "Red" : "Yellow"}`,
    [current]
  );

  return (
    <>
      <h1>Connect Four</h1>

      <ColumnButtons cols={COLS} onDrop={handleDrop} isDisabled={isDropDisabled} />

      <Grid board={board} />

      <div className="toolbar">
        <span className="status">{statusText}</span>
        <button className="resetBtn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
}
