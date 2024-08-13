import "./App.css";
import { useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";


export const ACTIONS = {
  INCREMENT_SESSION: "increment_sessionLength",
  DECREMENT_SESSION: "decrement_sessionLength",
  INCREMENT_BREAK: "increment_break",
  DECREMENT_BREAK: "decrement_break",
};

const initialState = {
  breakLength: 5,
  sessionLength: 25,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.INCREMENT_SESSION: {
      if (state.sessionLength < 60) {
        return { ...state, sessionLength: state.sessionLength + 1 };
      }
      return state;
    }
    case ACTIONS.DECREMENT_SESSION: {
      if (state.sessionLength > 0) {
        return { ...state, sessionLength: state.sessionLength - 1 };
      }
      return state;
    }
    case ACTIONS.INCREMENT_BREAK: {
      if (state.breakLength < 60) {
        return { ...state, breakLength: state.breakLength + 1 };
      }
      return state;
    }
    case ACTIONS.DECREMENT_BREAK: {
      if (state.breakLength > 0) {
        return { ...state, breakLength: state.breakLength - 1 };
      }
      return state;
    }
    default:
      return state;
  }
}

function App() {
  const [{ breakLength, sessionLength }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className="App">
      <div id="control-panel" className="control-panel">
        <div id="break-setter">
          <h2 id="break-label" className="break-label">
            Break Length
          </h2>
          <button
            id="break-decrement"
            className="break-decrement"
            onClick={() => {
              dispatch({ type: ACTIONS.DECREMENT_BREAK });
            }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <div id="break-length">{breakLength}</div>
          <button
            id="break-increment"
            className="break-increment"
            onClick={() => {
              dispatch({ type: ACTIONS.INCREMENT_BREAK });
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
        <div id="session-setter">
          <h2 id="session-label" className="sessionLength-label">
            Session Length
          </h2>
          <button
            id="session-decrement"
            className="session-decrement"
            onClick={() => {
              dispatch({ type: ACTIONS.DECREMENT_SESSION });
            }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <div id="session-length">{sessionLength}</div>
          <button
            id="session-increment"
            className="session-increment"
            onClick={() => {
              dispatch({ type: ACTIONS.INCREMENT_SESSION });
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
      <div id="timer" className="timer">
        <h1 id="timer-label" className="timer-label">
          Session
        </h1>
        <div id="time-left" className="time-left">
          {formatTime(sessionLength)}
        </div>
        <button id="start_stop" className="start_stop">
          start/stop
        </button>
        <button id="reset" className="reset">
          reset
        </button>
      </div>
    </div>
  );
}

function formatTime(minutes) {
  const seconds = minutes * 60;
  const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

export default App;
