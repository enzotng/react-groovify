import { useState } from "react";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const toggleClass = isChecked ? "toggle checked" : "toggle";

  return (
    <div className={`checkbox-wrapper-51 ${toggleClass}`} onClick={toggleCheckbox}>
      <input type="checkbox" checked={isChecked} onChange={() => {}} />
      <label className="toggle" htmlFor="cbx-51">
        <span>
          <svg viewBox="0 0 10 10" height="10px" width="10px">
            <path
              d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"
              fill="#fff"
            ></path>
          </svg>
        </span>
      </label>
    </div>
  );
};

export default Checkbox;
