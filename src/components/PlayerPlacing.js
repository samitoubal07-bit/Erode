import React from 'react';

const GRID_SIZE = 16;
const CELL_SIZE = 36;

export default function PlayerPlacing({ grid, players, onPlace }) {
  const needsP1 = !players.p1;
  const needsP2 = !players.p2;

  const handleClick = (row, col) => {
    if (!grid[row][col]) return;
    const pos = { row, col };

    if (needsP1) {
      onPlace(pos, 'p1');
    } else if (needsP2) {
      if (players.p1.row === row && players.p1.col === col) return;
      onPlace(pos, 'p2');
    }
  };

  const getCell = (row, col) => {
    if (players.p1?.row === row && players.p1?.col === col) return 'p1';
    if (players.p2?.row === row && players.p2?.col === col) return 'p2';
    return null;
  };

  return (
    <div>
      <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
        {needsP1 ? ' Player 1s turn ' : needsP2 ? ' Player 2 s turn' : ''}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '2px',
        backgroundColor: '#e2e8f0',
        padding: '8px',
        borderRadius: '12px',
        userSelect: 'none',
        marginBottom: '20px'
      }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const occupant = getCell(r, c);
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: !cell ? '#f0f4f8' :
                    occupant === 'p1' ? '#ef4444' :
                    occupant === 'p2' ? '#3b82f6' :
                    '#1e293b',
                  borderRadius: '4px',
                  cursor: cell ? 'pointer' : 'default',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                {occupant === 'p1' ? '🔴' : occupant === 'p2' ? '🔵' : ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
