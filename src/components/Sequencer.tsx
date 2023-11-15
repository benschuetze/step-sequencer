import { useState, useEffect } from "react";

const Sequencer = () => {
  const [steps, setSteps] = useState<Array<number>>([1, 2, 3, 4]);
  const [currentActiveStep, setCurrentActiveStep] = useState<number>(0);
  const [playerAction, setPlayerAction] = useState<string>("Start");
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);

  const interval = 60000 / 120;

  const playSequence = () => {
    setCurrentActiveStep((prev) => (prev === 4 ? 1 : prev + 1));
    setTimeoutId(setTimeout(playSequence, interval));
  };

  const handleStartStop = () => {
    if (playerAction === "Start") {
      clearTimeout(timeoutId);
      playSequence();
    } else {
      clearTimeout(timeoutId);
    }
    setPlayerAction((prev) => (prev === "Start" ? "Stop" : "Start"));
  };

  useEffect(() => {
    console.log(currentActiveStep);
  }, [currentActiveStep]);

  return (
    <>
      <button onClick={handleStartStop}>{playerAction}</button>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`border border-black  rounded px-2 py-1 cursor-pointer hover:bg-slate-300 ${
              step === currentActiveStep && "bg-black"
            }`}
          >
            O
          </div>
        ))}
      </div>
    </>
  );
};

export default Sequencer;
