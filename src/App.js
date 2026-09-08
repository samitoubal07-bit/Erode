import React, { useState } from 'react';
import MapEditor from './components/MapEditor';
import PlayerPlacing from './components/PlayerPlacing';
import Game from './components/Game';

const GRID_SIZE = 16;

const emptyGrid = () =>
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));

export default function App() {
  const [phase, setPhase] = useState('DRAWING');
  const [grid, setGrid] = useState(emptyGrid());
  const [players, setPlayers] = useState({ p1: null, p2: null });

  const handleMapDone = () => setPhase('PLACING');

  const handlePlayerPlaced = (pos, player) => {
    const updated = { ...players, [player]: pos };
    setPlayers(updated);
    if (updated.p1 && updated.p2) setPhase('PLAYING');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#1e40af', fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Erode</h1>

      {phase === 'DRAWING' && (
        <MapEditor grid={grid} setGrid={setGrid} onDone={handleMapDone} />
      )}
      {phase === 'PLACING' && (
        <PlayerPlacing grid={grid} players={players} onPlace={handlePlayerPlaced} />
      )}
      {phase === 'PLAYING' && (
        <Game grid={grid} setGrid={setGrid} players={players} />
      )}
    </div>
  );
}
