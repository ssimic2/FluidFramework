import React from 'react';
import './App.css';
import StatusDisplay from './components/StatusDisplay/StatusDisplay';
import StatusContainer from './components/StatusContainer/StatusContainer';
import StageLoadModal from "./components/StageLoadModal/StageLoadModal";

function App() {
  return (
    <div className="App">
        <StageLoadModal/>
        <StatusDisplay/>
        <StatusContainer/>
    </div>
  );
}

export default App;
