import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCirclePause,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";
import { ACTIONS, formatTime } from "../App";

export const Timer = ({
  isSession,
  isRunning,
  sessionLeft,
  breakLeft,
  audioRef,
  dispatch,
}) => {
  return (
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
  );
};
