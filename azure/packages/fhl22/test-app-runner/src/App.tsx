import React from 'react';
import './App.css';
import StatusDisplay from './components/StatusDisplay/StatusDisplay';
import StatusContainer from './components/StatusContainer/StatusContainer';
import HeaderButtons from './components/HeaderButtons/HeaderButtons';

function App() {
  return (
    <div className="App">
        <HeaderButtons/>
        <StatusDisplay/>
        <StatusContainer/>
    </div>
  );
}

export default App;
