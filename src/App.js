import './App.css';
import { useState } from 'react';

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [session, setSession] = useState(25);
  
  function formatTime(minutes) {
    const seconds = minutes * 60;
    const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  return (
    <div className="App">
      <div id="control-panel" className='control-panel'>
        <div id="break-setter">
          <h2 id='break-label' className='break-label'>Break Length</h2>
          <button id='break-decrement' className='break-decrement'>decrement</button>
          <div id="break-length">{breakTime}</div>
          <button id='break-increment' className='break-increment'>increment</button>
        </div>
        <div id="session-setter">
          <h2 id='session-label' className='session-label'>Session Length</h2>
          <button id='session-decrement' className='session-decrement'>decrement</button>
          <div id="session-length">{session}</div>
          <button id='session-increment' className='session-increment'>increment</button>
        </div>
      </div>
      <div id="timer" className="timer">
        <h1 id="timer-label" className="timer-label">Session</h1>
        <div id="time-left" className="time-left">{formatTime(session)}</div>
        <button id="start_stop" className="start_stop">start/stop</button>
        <button id="reset" className="reset">reset</button>
      </div>
    </div>
  );
}

export default App;
