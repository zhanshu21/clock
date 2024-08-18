import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ACTIONS } from "../App";

export const Decrement = ({ keyWord, dispatch, buttonDisabled }) => {
  return (
    <button
      id={`${keyWord}-decrement`}
      className={`${keyWord}-decrement`}
      onClick={() => {
        dispatch({
          type:
            keyWord === "break"
              ? ACTIONS.DECREMENT_BREAK
              : ACTIONS.DECREMENT_SESSION,
        });
      }}
      disabled={buttonDisabled}
    >
      <FontAwesomeIcon icon={faArrowDown} className="icons" />
    </button>
  );
};
