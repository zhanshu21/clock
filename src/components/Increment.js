import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { ACTIONS } from "../App";

export const Increment = ({ keyWord, dispatch, buttonDisabled }) => {
  return (
    <button
      id={`${keyWord}-increment`}
      className={`${keyWord}-increment`}
      onClick={() => {
        dispatch({
          type:
            keyWord === "break"
              ? ACTIONS.INCREMENT_BREAK
              : ACTIONS.INCREMENT_SESSION,
        });
      }}
      disabled={buttonDisabled}
    >
      <FontAwesomeIcon icon={faArrowUp} className="icons"/>
    </button>
  );
};
