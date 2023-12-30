import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export type ConwayBoardProps = {
    className?: string;
    width: number;
    height: number;
    gridSize: number;
}

export const ConwayBoard = ({gridSize, height, width}: ConwayBoardProps) => {
  let gameActive = false;
  const gameRateMs = 40;
  let clock = 0
  const grid: boolean[][] = Array.from(Array(width / gridSize), () => new Array(height / gridSize).fill(false));
  
  const canvas = useRef<HTMLCanvasElement>(null);

  let mouseX = 0, mouseY = 0

  const generateGrid = () => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      for (let row = 0; row < width / gridSize; row++) {
        for (let col = 0; col < height / gridSize; col++) {
          ctx.fillRect(row * gridSize, col * gridSize, gridSize, gridSize);
          ctx.strokeRect(row * gridSize, col * gridSize, gridSize, gridSize);
        }
      }
    }
  }

  const applyConwayRules = () => {
    const originalGrid = []
    for (let i = 0; i < grid.length; i++) {
      originalGrid.push(grid[i].slice(0));
    }
    
    /*
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col <  grid[row].length; col++) {
        if (originalGrid[row][col])
        {
          if (checkUnderPopulation(row, col, originalGrid)) {
            grid[row][col] = false;
          }
          if (checkOverPopulation(row, col, originalGrid)) {
            grid[row][col] = false;
          }
          if (checkWillLive(row, col, originalGrid)) {
            grid[row][col] = true;
          }
        }
        else if(checkComeAlive(row, col, originalGrid)) {
          grid[row][col] = true;
        }
      }
    }
  }

  const getNeighbors = (row: number, col: number, oldGrid: boolean[][]) => {
    const neighbors: boolean[] = [];
    for (let i = row - 1; i < row + 2; i++) {
      for (let j = col - 1; j < col + 2; j++) {
        if (i >= 0 && j >= 0 && i < oldGrid.length && j < oldGrid[i].length)
        {
          if(oldGrid[i][j] && !(i === row && j === col))
          {
            neighbors.push(oldGrid[i][j]);
          }
        }
      }
    }
    return neighbors;
  }

  const checkUnderPopulation = (row: number, col: number, oldGrid: boolean[][]) => {
    return getNeighbors(row, col, oldGrid).length < 2;
  }

  const checkOverPopulation = (row: number, col: number, oldGrid: boolean[][]) => {
    return getNeighbors(row, col, oldGrid).length > 3;
  }

  
  const checkComeAlive = (row: number, col: number, oldGrid: boolean[][]) => {
    return getNeighbors(row, col, oldGrid).length === 3;
  }

  const checkWillLive = (row: number, col: number, oldGrid: boolean[][]) => {
    const numLiveNeighbors = getNeighbors(row, col, oldGrid).length;
    return numLiveNeighbors === 2 || numLiveNeighbors === 3;
  }

  const handleClick = ({x, y}: MouseEvent) => {
    const row = Math.floor(x / gridSize);
    const col = Math.floor(y / gridSize);
    grid[col][row] = true;
  }

  const colorRect = (clickX: number, clickY: number, color: string | CanvasGradient | CanvasPattern, outline?: boolean) => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(clickX, clickY, gridSize, gridSize);
      outline && ctx.strokeRect(clickX, clickY, gridSize, gridSize);
    }
  }

  const handleMovement = ({clientX, clientY}: MouseEvent) => {
    mouseX = clientX;
    mouseY = clientY;
  }

  const snapPosition = (x: number, y: number) => {
    const row = Math.floor(x / gridSize);
    const col = Math.floor(y / gridSize);
    colorRect(row * gridSize, col * gridSize, '#ebebeb', true);
  }

  useEffect(() => {
    generateGrid();
    canvas.current?.addEventListener('mousedown', (event) => handleClick(event));
    canvas.current?.addEventListener('mousemove', (event) => handleMovement(event));
    window.requestAnimationFrame(draw);
  })

  const draw = () => {
    generateGrid();
    snapPosition(mouseX, mouseY);

    if(clock > gameRateMs && gameActive)
    {
      clock = 0
      applyConwayRules()
    }

    for (let row = 0; row <  grid.length; row++) {
      for (let col = 0;  col < grid[row].length; col++) {
        if (grid[row][col]) {
          colorRect(col * gridSize, row * gridSize, 'black');
        }
      }
    }
    
    gameActive && clock++;

    window.requestAnimationFrame(draw);
  }

  return (
    <>
      <canvas height={1000} width={1000} ref={canvas} className='bg-white' />
      <button onClick={() => gameActive = !gameActive}>Start/Stop</button>
    </>
  );
}