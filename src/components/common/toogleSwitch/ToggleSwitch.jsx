import { useState } from "react";
import "./ToggleSwitch.scss";

const ToggleSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="dark-mode-switch">
      <span className="darkmode">Darkmode</span>
      <label className="switch">
        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
