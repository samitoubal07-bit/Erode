import React, { useState, useCallback } from 'react';

const GRID_SIZE = 16;
const CELL_SIZE = 36;
const DIAGONAL_BANK = 3;

export default function Game({ grid: initialGrid, players: initialPlayers }) {
  const [grid, setGrid] = useState(initialGrid.map(r => [...r]));
  const [positions, setPositions] = useState(initialPlayers);
  const [turn, setTurn] = useState('p1');
  const [winner, setWinner] = useState(null);
  const [diagonals, setDiagonals] = useState({ p1: DIAGONAL_BANK, p2: DIAGONAL_BANK });
  const [useDiagonal, setUseDiagonal] = useState(false);

  const getValidMoves = useCallback((pos, allowDiagonal, currentPositions, currentGrid) => {
    const moves = [];
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    if (allowDiagonal) dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);

    for (const [dr, dc] of dirs) {
      const nr = pos.row + dr;
      const nc = pos.col + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && currentGrid[nr][nc]) {
        const other = turn === 'p1' ? currentPositions.p2 : currentPositions.p1;
        if (other.row !== nr || other.col !== nc) {
          moves.push({ row: nr, col: nc });
        }
      }
    }
    return moves;
  }, [turn]);

  const handleMove = (row, col) => {
    if (winner) return;
    const currentPos = positions[turn];
    const validMoves = getValidMoves(currentPos, useDiagonal, positions, grid);
    const isValid = validMoves.some(m => m.row === row && m.col === col);
    if (!isValid) return;

    // Check if diagonal move
    const dr = Math.abs(row - currentPos.row);
    const dc = Math.abs(col - currentPos.col);
    const wasDiagonal = dr === 1 && dc === 1;

    // Remove square player left
    const newGrid = grid.map(r => [...r]);
    newGrid[currentPos.row][currentPos.col] = false;
    setGrid(newGrid);

    // Update diagonal bank if used
    if (wasDiagonal) {
      setDiagonals(prev => ({ ...prev, [turn]: prev[turn] - 1 }));
    }

    // Move player
    const newPositions = { ...positions, [turn]: { row, col } };
    setPositions(newPositions);
    setUseDiagonal(false);

    // Check if next player has moves
    const nextTurn = turn === 'p1' ? 'p2' : 'p1';
    const nextPos = newPositions[nextTurn];
    const nextMoves = getValidMoves(nextPos, false, newPositions, newGrid);
    const nextMovesWithDiag = getValidMoves(nextPos, true, newPositions, newGrid);

    if (nextMoves.length === 0 && nextMovesWithDiag.length === 0) {
      setWinner(turn);
      return;
    }

    if (nextMoves.length === 0 && diagonals[nextTurn] === 0) {
      setWinner(turn);
      return;
    }

    setTurn(nextTurn);
  };

  const validMoves = getValidMoves(positions[turn], useDiagonal, positions, grid);

  const getCellStyle = (r, c) => {
    const isP1 = positions.p1.row === r && positions.p1.col === c;
    const isP2 = positions.p2.row === r && positions.p2.col === c;
    const isValidMove = validMoves.some(m => m.row === r && m.col === c);
    const isEnabled = grid[r][c];

    if (!isEnabled) return '#f0f4f8';
    if (isP1) return '#ef4444';
    if (isP2) return '#3b82f6';
    if (isValidMove) return '#bae6fd';
    return '#1e293b';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {winner ? (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: '700', color: winner === 'p1' ? '#ef4444' : '#3b82f6' }}>
            {winner === 'p1' ? 'Player 1 wins!' : 'Player 2 wins!'}
          </p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0ea5e9', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
            Play again
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ color: turn === 'p1' ? '#ef4444' : '#3b82f6', fontWeight: '600', fontSize: '16px' }}>
            {turn === 'p1' ? 'Player 1' : 'Player 2'}'s turn
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            <p style={{ color: '#94a3b8', fontSize: '12px' }}> Player 1 Diagonals: {diagonals.p1}</p>
            <p style={{ color: '#94a3b8', fontSize: '12px' }}> Player 2 Diagonals: {diagonals.p2}</p>
          </div>
          {diagonals[turn] > 0 && (
            <button
              onClick={() => setUseDiagonal(d => !d)}
              style={{
                marginTop: '8px',
                padding: '6px 16px',
                borderRadius: '8px',
                border: `1.5px solid ${useDiagonal ? '#0ea5e9' : '#e2e8f0'}`,
                backgroundColor: useDiagonal ? '#e0f2fe' : '#fff',
                color: useDiagonal ? '#0ea5e9' : '#94a3b8',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {useDiagonal ? '↗ Diagonal ON' : 'Use diagonal'}
            </button>
          )}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: '2px',
        backgroundColor: '#e2e8f0',
        padding: '8px',
        borderRadius: '12px',
        userSelect: 'none'
      }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleMove(r, c)}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: getCellStyle(r, c),
                borderRadius: '4px',
                cursor: validMoves.some(m => m.row === r && m.col === c) ? 'pointer' : 'default',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'background-color 0.15s'
              }}
            >
              {positions.p1.row === r && positions.p1.col === c ? '🔴' :
               positions.p2.row === r && positions.p2.col === c ? '🔵' : ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
