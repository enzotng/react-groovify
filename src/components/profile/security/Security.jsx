import { Link } from "react-router-dom";
import { useUserContext } from "../../config/UserContext";

import ToggleSwitch from "../../common/ToggleSwitch/ToggleSwitch";

import "./Security.scss";

const Security = () => {
  // const { userProfile } = useUserContext();

  return (
    <div className="security-wrapper">
      <div className="heading-wrapper">
        <Link to="/profile">
          {" "}
          <svg
            id="arrow-back"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="c-vector"
              d="M9.86681 1.0489L5.32158 5.59413C5.27937 5.63639 5.22924 5.66992 5.17406 5.69279C5.11888 5.71566 5.05973 5.72744 5 5.72744C4.94027 5.72744 4.88113 5.71566 4.82595 5.69279C4.77077 5.66992 4.72064 5.63639 4.67843 5.59413L0.133201 1.0489C0.0479137 0.963616 0 0.847942 0 0.727328C0 0.606714 0.0479137 0.49104 0.133201 0.405753C0.218488 0.320466 0.334162 0.272552 0.454775 0.272552C0.575389 0.272552 0.691063 0.320466 0.77635 0.405753L5 4.62997L9.22366 0.405753C9.26589 0.363523 9.31602 0.330025 9.3712 0.30717C9.42637 0.284315 9.48551 0.272552 9.54523 0.272552C9.60495 0.272552 9.66409 0.284315 9.71927 0.30717C9.77444 0.330025 9.82458 0.363523 9.86681 0.405753C9.90904 0.447983 9.94253 0.498117 9.96539 0.553293C9.98824 0.608469 10 0.667606 10 0.727328C10 0.78705 9.98824 0.846187 9.96539 0.901363C9.94253 0.956539 9.90904 1.00667 9.86681 1.0489Z"
              fill="white"
            />
          </svg>
        </Link>
        <h1>Security</h1>
      </div>
      <ToggleSwitch />
    </div>
  );
};

export default Security;
