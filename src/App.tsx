import { useState } from "react";
import "./App.css";
import Sequencer from "./components/Sequencer";

function App() {
  const [bpm, setBpm] = useState(120);
  return (
    <>
      <div className="flex items-center justify-center">
        <input
          className="mx-auto text-center"
          type="number"
          value={bpm || ""}
          // oninput={updateValue(this.value)}
          onChange={(e) => {
            const value = e.target.value;
            const parsedValue = parseInt(value) || 0;
            if (parsedValue >= 0) setBpm(parsedValue);
          }}
        />
      </div>
      <div className="w-screen h-screen flex items-center justify-center">
        <Sequencer bpm={bpm} />
      </div>
    </>
  );
}

export default App;
