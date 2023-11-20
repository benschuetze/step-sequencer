import { useState, useEffect } from 'react'
import { supabase } from '../../supabase.tsx'
import { getSignedUrlsResponses } from '../services/db.tsx'
import { createBuffer, getCompleteAudioInfo, createSource, playAudio } from '../services/audio.tsx'
import { audiocontext } from '../services/audio.tsx'
//types
import { AudioInfo } from '../types/audio'

type SequencerProps = {
  bpm: number
}

const Sequencer = ({ bpm }: SequencerProps) => {
  const [steps, setSteps] = useState<number>(16)
  const [filledSteps, setFilledSteps] = useState<Array<AudioInfo>>([])
  const [activatedSteps, setActivatedSteps] = useState<Array<number>>([])
  const [currentActiveStep, setCurrentActiveStep] = useState<number>(0)
  const [playerAction, setPlayerAction] = useState<string>('Start')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const fillStepsWithAudioObjects = async (audioObjects: Array<AudioInfo>) => {
    //This is just for first development, later there will be more items in the array so logic will have to be adjusted
    const filledSteps: Array<AudioInfo | null> = []
    const fillSteps = async () => {
      // initialize the steps array
      for (let i = 0; i < steps; i++) {
        filledSteps.push(null)
      }

      for (const [i] of filledSteps.entries()) {
        const clonedAudioObj = Object.assign({}, audioObjects[0])
        console.log('I ist: ', i)

        clonedAudioObj.step = i + 1
        clonedAudioObj.activated = false
        clonedAudioObj.buffer = await createBuffer(audioObjects[0])
        clonedAudioObj.source = createSource(audioObjects[0])
        console.log('CLONED AUDIO Object: ', clonedAudioObj)
        filledSteps[i] = clonedAudioObj
      }
    }
    await fillSteps()
    console.log('FILLED STEPS: ', filledSteps)
    return filledSteps
  }

  const getSamples = async () => {
    try {
      const { data, error } = await supabase.storage.from('kicks').list()
      if (error) {
        console.error('Error fetching bucket content:', error.message)
      } else {
        const signedUrlsResponses = getSignedUrlsResponses(data)
        const audioInfoArray: Array<AudioInfo> = await Promise.all(signedUrlsResponses)

        // hier brauch ich schon alle steps
        const completeAudioInfo = await getCompleteAudioInfo(audioInfoArray)

        console.log('COMPLETE AUDIO INFO: ', completeAudioInfo)

        const filledStepsOnFirstRender = await fillStepsWithAudioObjects(completeAudioInfo)

        setFilledSteps(filledStepsOnFirstRender)
      }
    } catch (e) {
      console.error('SUPABASE ERROR: ', e)
    }
  }

  let index = 0
  const playSequence2 = (bpmChangeWhilePlaying = false) => {
    if (bpm > 0) {
      const interval = 60000 / bpm / 4
      const currentStep = filledSteps[index]
      setCurrentActiveStep(currentStep.step)

      // Check if the AudioBufferSourceNode is already started
      if (currentStep.activated) {
        console.log('SHOULD PLAY')
        currentStep.source?.start()
        console.log('Current Step: ', currentStep)
      }

      if (bpmChangeWhilePlaying) {
        setTimeoutId(setTimeout(playSequence2, interval))
      } else {
        index === 15 ? (index = 0) : index++

        currentStep.source = audiocontext.createBufferSource()
        currentStep.source.buffer = currentStep.buffer
        currentStep.source.connect(audiocontext.destination)

        setTimeoutId(setTimeout(playSequence2, interval))
      }
    }
  }

  const handleStartStop = () => {
    if (playerAction === 'Start' && bpm > 0) {
      clearTimeout(timeoutId)
      playSequence2()
    } else {
      clearTimeout(timeoutId)
      setCurrentActiveStep(0)
    }
    setPlayerAction((prev) => (prev === 'Start' ? 'Stop' : 'Start'))
  }

  const handleActivatedSteps = (step: number) => {
    setActivatedSteps((prev) => {
      if (prev.includes(step)) {
        const updatedSteps = [...prev]
        updatedSteps.splice(updatedSteps.indexOf(step), 1)

        return updatedSteps
      } else {
        return [...prev, step]
      }
    })
  }

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
    } else {
      if (bpm > 0 && playerAction === 'Stop') {
        clearTimeout(timeoutId)
        playSequence2(true)
      }
    }
  }, [bpm])

  useEffect(() => {
    filledSteps.forEach((step) => {
      if (activatedSteps.includes(step.step)) {
        step.activated = true
      } else {
        step.activated = false
      }
    })
  }, [activatedSteps])

  useEffect(() => {
    console.log('FIlled Steps: ', filledSteps)
  }, [filledSteps])

  // idee für sequencer logik: array aus audioinfo objekten, durch das arreay wird geloopt in in bpm interval geschwindigkeit, wenn audioobj.activated === true => audioObj.source.play()

  useEffect(() => {
    getSamples()
  }, [])

  return (
    <>
      <button onClick={handleStartStop}>{playerAction}</button>
      <div className="grid grid-cols-16 gap-2">
        {filledSteps.map((step, index) => {
          const stepIsActive = activatedSteps.includes(step.step)
          return (
            <div
              key={index}
              className={`border border-black rounded px-2 py-1 cursor-pointer bg ${
                step.step === currentActiveStep ? 'bg-red-400' : ''
              } ${stepIsActive ? 'bg-black' : 'hover:bg-slate-300'}`}
              onClick={() => handleActivatedSteps(step.step)}
            >
              O
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Sequencer
