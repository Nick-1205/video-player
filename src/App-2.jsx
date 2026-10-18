import { useState, useCallback } from "react";
import "./App.css";
import Button from "./Button";

function App() {
  const [toggle, setToggle] = useState(false);

  const onClick = () => {
    console.log("clicked");
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {toggle ? "X" : "0"}
      </button>

      <Button onClick={onclick}></Button>
    </div>
  );
}

export default App;
