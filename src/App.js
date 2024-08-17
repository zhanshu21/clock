import "./App.css";
import { useReducer, useEffect, useRef } from "react";
import wavFile from "./notification.wav";
import { Timer } from "./components/Timer";
import { Decrement } from "./components/Decrement";
import { Increment } from "./components/Increment";

// todo:
//       add CSS;

export const ACTIONS = {
  INCREMENT_SESSION: "increment-sessionLength",
  DECREMENT_SESSION: "decreme-t-sessionLength",
  INCREMENT_BREAK: "increment-break",
  DECREMENT_BREAK: "decrement-break",
  TOGGLE_PLAY_PAUSE: "toggle-play-pause",
  RESET: "reset",
  SESSIONTICK: "sessionTick",
  BREAKTICK: "breakTick",
  SWITCH_SESSION_BREAK: "switch-session-break",
  DISABLE_BUTTON: "disable-button",
  ENABLE_BUTTON: "enable-button",
};

const initialState = {
  breakLength: 5,
  breakLeft: 5 * 60,
  sessionLength: 25,
  sessionLeft: 25 * 60,
  isRunning: false,
  isSession: true,
  buttonDisabled: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.INCREMENT_SESSION: {
      let newLength = Math.min(60, state.sessionLength + 1);
      return {
        ...state,
        sessionLength: newLength,
        sessionLeft: newLength * 60,
      };
    }
    case ACTIONS.DECREMENT_SESSION: {
      let newLength = Math.max(1, state.sessionLength - 1);
      return {
        ...state,
        sessionLength: newLength,
        sessionLeft: newLength * 60,
      };
    }
    case ACTIONS.INCREMENT_BREAK: {
      let newLength = Math.min(60, state.breakLength + 1);
      return { ...state, breakLength: newLength, breakLeft: newLength * 60 };
    }
    case ACTIONS.DECREMENT_BREAK: {
      let newLength = Math.max(1, state.breakLength - 1);
      return { ...state, breakLength: newLength, breakLeft: newLength * 60 };
    }
    case ACTIONS.TOGGLE_PLAY_PAUSE:
      return { ...state, isRunning: !state.isRunning };
    case ACTIONS.RESET:
      return initialState;
    case ACTIONS.SESSIONTICK:
      return { ...state, sessionLeft: state.sessionLeft - 1 };
    case ACTIONS.BREAKTICK:
      return { ...state, breakLeft: state.breakLeft - 1 };
    case ACTIONS.SWITCH_SESSION_BREAK:
      return {
        ...state,
        isSession: !state.isSession,
        isRunning: true,
        breakLeft: state.breakLength * 60,
        sessionLeft: state.sessionLength * 60,
      };
    case ACTIONS.DISABLE_BUTTON:
      return { ...state, buttonDisabled: true };
    case ACTIONS.ENABLE_BUTTON:
      return { ...state, buttonDisabled: false };
    default:
      return state;
  }
}

function App() {
  const [
    {
      breakLength,
      breakLeft,
      sessionLength,
      sessionLeft,
      isRunning,
      isSession,
      buttonDisabled,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const audioRef = useRef(null);

  useEffect(() => {
    let timer = null;
    // let audio = new Audio(wavFile);

    if (isRunning) {
      dispatch({ type: ACTIONS.DISABLE_BUTTON });
      timer = setInterval(() => {
        if (isSession && sessionLeft > 0) {
          dispatch({ type: ACTIONS.SESSIONTICK });
        } else if (!isSession && breakLeft > 0) {
          dispatch({ type: ACTIONS.BREAKTICK });
        } else if (sessionLeft === 0 && isSession) {
          dispatch({ type: ACTIONS.SWITCH_SESSION_BREAK });
          audioRef.current.play();
          // audio.play();
          // dispatch({ type: ACTIONS.TOGGLE_PLAY_PAUSE }); // Stop the timer for a moment after switching
        } else if (breakLeft === 0 && !isSession) {
          dispatch({ type: ACTIONS.SWITCH_SESSION_BREAK });
          audioRef.current.play();
          // audio.play();
          // dispatch({ type: ACTIONS.TOGGLE_PLAY_PAUSE }); // Stop the timer for a moment after switching
        }
      }, 1000);
    } else {
      dispatch({ type: ACTIONS.ENABLE_BUTTON });
    }
    // cleanup function that React calls when the component unmounts
    // or before the effect runs again (i.e., when dependency changes
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, sessionLeft, isSession, breakLeft]);

  return (
    <div className="App">
      <audio id="beep" ref={audioRef} src={wavFile}></audio>
      <div id="control-panel" className="control-panel">
        <div id="break-setter">
          <h2 id="break-label" className="break-label">
            Break Length
          </h2>
          <Decrement keyWord="break" dispatch={dispatch} buttonDisabled={buttonDisabled} />
          <div id="break-length">{breakLength}</div>
          <Increment keyWord="break" dispatch={dispatch} buttonDisabled={buttonDisabled} />
        </div>
        <div id="session-setter">
          <h2 id="session-label" className="sessionLength-label">
            Session Length
          </h2>
          <Decrement keyWord="session" dispatch={dispatch} buttonDisabled={buttonDisabled} />
          <div id="session-length">{sessionLength}</div>
          <Increment keyWord="session" dispatch={dispatch} buttonDisabled={buttonDisabled} />
        </div> 
      </div>
      <Timer
        isRunning={isRunning}
        isSession={isSession}
        sessionLeft={sessionLeft}
        breakLeft={breakLeft}
        audioRef={audioRef}
        dispatch={dispatch}
      />
    </div>
  );
}

export function formatTime(seconds) {
  const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

export default App;
