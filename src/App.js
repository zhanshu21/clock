import "./App.css";
import { useReducer, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faArrowRotateLeft,
  faCirclePause,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";
import wavFile from "./notification.wav";
// todo:
//       add CSS;
//       disable all increment and decrement button when the timer is on;
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
  ENABLE_BUTTON: "enable-button"
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
          <button
            id="break-decrement"
            className="break-decrement"
            onClick={() => {
              dispatch({ type: ACTIONS.DECREMENT_BREAK });
            }}
            disabled = {buttonDisabled}
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
            disabled = {buttonDisabled}
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
            disabled = {buttonDisabled}
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
            disabled = {buttonDisabled}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
      <div id="timer" className="timer">
        <h1 id="timer-label" className="timer-label">
          {isSession ? "Session" : "Break"}
        </h1>
        <div id="time-left" className="time-left">
          {isSession ? formatTime(sessionLeft) : formatTime(breakLeft)}
        </div>
        <button
          id="start_stop"
          className="start_stop"
          onClick={() => {
            dispatch({ type: ACTIONS.TOGGLE_PLAY_PAUSE });
          }}
        >
          {isRunning ? (
            <FontAwesomeIcon icon={faCirclePause} />
          ) : (
            <FontAwesomeIcon icon={faCirclePlay} />
          )}
        </button>
        <button
          id="reset"
          className="reset"
          onClick={() => {
            dispatch({ type: ACTIONS.RESET });
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Rewind to the beginning
          }}
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

export default App;
