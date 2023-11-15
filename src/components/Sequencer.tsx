import { useState, useEffect } from "react";

type SequencerProps = {
  bpm: number;
};

const Sequencer = ({ bpm }: SequencerProps) => {
  const [steps, setSteps] = useState<Array<number>>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);
  const [activatedSteps, setActivatedSteps] = useState<Array<number>>([]);
  const [currentActiveStep, setCurrentActiveStep] = useState<number>(0);
  const [playerAction, setPlayerAction] = useState<string>("Start");
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const playSequence = () => {
    console.log("BPM: ", bpm);
    if (bpm > 0) {
      const interval = 60000 / bpm / 4;
      setCurrentActiveStep((prev) => (prev === 16 ? 1 : prev + 1));
      setTimeoutId(setTimeout(playSequence, interval));
    }
  };

  const handleStartStop = () => {
    if (playerAction === "Start" && bpm > 0) {
      clearTimeout(timeoutId);
      playSequence();
    } else {
      clearTimeout(timeoutId);
      setCurrentActiveStep(0);
    }
    setPlayerAction((prev) => (prev === "Start" ? "Stop" : "Start"));
  };

  const handleActivatedSteps = (step: number) => {
    setActivatedSteps((prev) => {
      console.log("includes step: ", prev.includes(step));
      if (prev.includes(step)) {
        const updatedSteps = [...prev];
        updatedSteps.splice(updatedSteps.indexOf(step), 1);
        console.log("UPDATED STEPS:", updatedSteps);
        return updatedSteps;
      } else {
        return [...prev, step];
      }
    });
  };

  // use effect der ausgeführt wirtd wenn bpm sich ändert und in dem die aktuelle timeout id gecleart wird und an der selben stelle im player play sequence nochmal ausgeführt wird

  useEffect(() => {
    console.log("BPM in SEQUENCER: ", bpm);
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      console.log(bpm);
      if (bpm > 0 && playerAction === "Stop") {
        clearTimeout(timeoutId);
        playSequence();
      }
    }
  }, [bpm]);

  return (
    <>
      <button onClick={handleStartStop}>{playerAction}</button>
      <div className="grid grid-cols-16 gap-2">
        {steps.map((step) => (
          <div
            key={step}
            className={`border border-black  rounded px-2 py-1 cursor-pointer  bg ${
              step === currentActiveStep && "bg-red-400"
            } ${
              activatedSteps.includes(step) ? "bg-black" : "hover:bg-slate-300"
            }`}
            onClick={() => handleActivatedSteps(step)}
          >
            O
          </div>
        ))}
      </div>
    </>
  );
};

export default Sequencer;
