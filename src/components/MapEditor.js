import React, { useState } from 'react';

const GRID_SIZE = 16;
const CELL_SIZE = 36;

export default function MapEditor({ grid, setGrid, onDone }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragValue, setDragValue] = useState(true);
  const [baseGrid, setBaseGrid] = useState(null);

  const applyRect = (base, start, end, value) => {
    const minR = Math.min(start.row, end.row);
    const maxR = Math.max(start.row, end.row);
    const minC = Math.min(start.col, end.col);
    const maxC = Math.max(start.col, end.col);
    const next = base.map(r => [...r]);
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        next[r][c] = value;
      }
    }
    return next;
  };

  const handleMouseDown = (row, col) => {
    const value = !grid[row][col];
    const snapshot = grid.map(r => [...r]);
    setDragStart({ row, col });
    setDragValue(value);
    setBaseGrid(snapshot);
    setIsDragging(true);
    setGrid(applyRect(snapshot, { row, col }, { row, col }, value));
  };

  const handleMouseEnter = (row, col) => {
    if (!isDragging || !dragStart || !baseGrid) return;
    setGrid(applyRect(baseGrid, dragStart, { row, col }, dragValue));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setBaseGrid(null);
  };

  const enabledCount = grid.flat().filter(Boolean).length;

  return (
    <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '2px',
        backgroundColor: '#e2e8f0',
        padding: '10px',
        borderRadius: '8px',
        userSelect: 'none',
        marginBottom: '8px'
      }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell ? '#1e293b' : '#f8fafc',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.05s',
                border: '1px solid #e2e8f0'
              }}
            />
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>{enabledCount} squares enabled</p>
        <button
          onClick={onDone}
          disabled={enabledCount < 4}
          style={{
            padding: '10px 24px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: enabledCount >= 4 ? '#0ea5e9' : '#e2e8f0',
            color: enabledCount >= 4 ? '#fff' : '#94a3b8',
            fontWeight: '600',
            fontSize: '14px',
            cursor: enabledCount >= 4 ? 'pointer' : 'not-allowed'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
