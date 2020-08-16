import "./Toolbar.css";
import React, {useState, useEffect} from "react";

function viewportToPixels(value) {
    var parts = value.match(/([0-9.]+)(vh|vw)/)
    var q = Number(parts[1])
    var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
    return side * (q / 100)
}

const Toolbar = ({ width, height, children }) => {
  const [xPosition, setX] = useState(-viewportToPixels(width));

  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
    } else {
      setX(-1 * viewportToPixels(width));
    }
  };

  useEffect(() => {
    setX(0);
  }, []);
  return (
    <React.Fragment>
      <div
        className="toolbar"
        style={{
          transform: `translatex(${xPosition}px)`,
          width: width,
          minHeight: height
        }}
      >
        <button
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={{
            transform: `translate(${width}, 50vh)`
          }}
        ></button>
        <div className="content">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default Toolbar