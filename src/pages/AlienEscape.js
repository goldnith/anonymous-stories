import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AlienEscape.css';

const INITIAL_STATE = {
    alienPosition: 50,
    humans: [],  // Array of human obstacles
    score: 0,
    fuel: 100,   // Fuel level for escape
    gameSpeed: 50,
    isGameOver: false,
    earthGravity: 1
  };
  
  const AlienEscape = () => {
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const gameAreaRef = useRef(null);
    const gameLoopRef = useRef(null);
    const fuelIntervalRef = useRef(null);
  
    const { alienPosition, humans, score, fuel, gameSpeed, isGameOver, earthGravity } = gameState;
  
    // Generate random humans
    const generateHuman = useCallback(() => ({
      x: 100,
      y: Math.random() * 80 + 10,
      type: Math.random() > 0.7 ? 'soldier' : 'civilian'
    }), []);
  
    // Handle alien movement
    const handleMovement = useCallback((e) => {
      if (isGameOver || fuel <= 0) return;
  
      const MOVEMENT_STEP = 8;
      const FUEL_COST = 1;
  
      setGameState(prev => ({
        ...prev,
        fuel: prev.fuel - FUEL_COST,
        alienPosition: e.key === 'ArrowUp'
          ? Math.max(0, prev.alienPosition - MOVEMENT_STEP)
          : e.key === 'ArrowDown'
            ? Math.min(100, prev.alienPosition + MOVEMENT_STEP * earthGravity)
            : prev.alienPosition
      }));
    }, [isGameOver, fuel, earthGravity]);
  
    // Game loop
    useEffect(() => {
      if (isGameOver || fuel <= 0) return;
  
      gameLoopRef.current = setInterval(() => {
        setGameState(prev => {
          // Move humans and add new ones
          let newHumans = prev.humans
            .map(human => ({ ...human, x: human.x - 2 }))
            .filter(human => human.x > -10);
  
          if (Math.random() < 0.05) {
            newHumans.push(generateHuman());
          }
  
          // Check collisions
          const collision = newHumans.some(human => 
            human.x <= 15 && 
            Math.abs(human.y - prev.alienPosition) < 15 &&
            (human.type === 'soldier' || Math.random() < 0.3)
          );
  
          if (collision || fuel <= 0) {
            clearInterval(gameLoopRef.current);
            clearInterval(fuelIntervalRef.current);
            return { ...prev, isGameOver: true };
          }
  
          return {
            ...prev,
            humans: newHumans,
            earthGravity: Math.min(1.5, 1 + (prev.score / 1000)),
            score: prev.score + 1
          };
        });
      }, gameSpeed);
  
      return () => clearInterval(gameLoopRef.current);
    }, [isGameOver, gameSpeed, fuel, generateHuman]);
  
    // Return JSX with updated theme
    return (
      <div className="alien-escape">
        <h1>Escape From Earth!</h1>
        <div className="stats">
          <div className="fuel">Fuel: {fuel}%</div>
          <div className="score">Distance: {score}m</div>
        </div>
        
        <div className="game-area" ref={gameAreaRef}>
          <div 
            className="alien"
            style={{ top: `${alienPosition}%` }}
          />
          {humans.map((human, index) => (
            <div 
              key={index}
              className={`human ${human.type}`}
              style={{ 
                left: `${human.x}%`,
                top: `${human.y}%`
              }}
            />
          ))}
        </div>
  
        {isGameOver && (
          <div className="game-over">
            <h2>{fuel <= 0 ? 'Out of Fuel!' : 'Captured!'}</h2>
            <p>Distance Traveled: {score}m</p>
            <button onClick={() => setGameState(INITIAL_STATE)}>
              Try Another Escape
            </button>
          </div>
        )}
      </div>
    );
  };

export default AlienEscape;