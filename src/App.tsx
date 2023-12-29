import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ConwayBoard } from './components/ConwayBoard';

function App() {
  return (
    <div className="App">
      <ConwayBoard gridSize={50} width={1000} height={1000}/>
    </div>
  );
}

export default App;
