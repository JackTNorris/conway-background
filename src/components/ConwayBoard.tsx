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
  let gameRateMs = 500;
  const grid = Array.from(Array(width / gridSize), () => new Array(height / gridSize).fill(false));
  
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

  const handleClick = ({x, y}: MouseEvent) => {
    const row = Math.floor(x / gridSize);
    const col = Math.floor(y / gridSize);
    grid[col][row] = true;
    console.log(grid)
    console.log("x: " + row + " y: " + col)
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
    canvas.current?.addEventListener('mousemove', (event) => handleMovement(event))
    window.requestAnimationFrame(draw);
  })

  const draw = () => {
    const ctx = canvas.current?.getContext('2d');
    generateGrid();
    snapPosition(mouseX, mouseY);
    /*
    for (let row = 0; row < grid.length; row++) {
      console.log(row)
    }
    */
    
    for (let row = 0; row <  grid.length; row++) {
      console.log(row)
      for (let col = 0;  col < grid[row].length; col++) {
        if (grid[row][col]) {
          console.log("x: " + row + " y: " + col)
          colorRect(col * gridSize, row * gridSize, 'black');
        }
      }
    }
    
    
    
    window.requestAnimationFrame(draw);
  }

  return (
    <canvas height={1000} width={1000} ref={canvas} className='bg-white' />
  );
}