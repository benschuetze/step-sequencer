import { useState, useEffect } from 'react'
import { supabase } from '../../supabase.tsx'
import { getSignedUrlsResponses } from '../services/db.tsx'
import { getCompleteAudioInfo } from '../services/audio.tsx'

//types
import { AudioInfo } from '../types/audio'

type SequencerProps = {
  bpm: number
}

const Sequencer = ({ bpm }: SequencerProps) => {
  const [steps, setSteps] = useState<Array<number>>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  const [activatedSteps, setActivatedSteps] = useState<Array<number>>([])
  const [currentActiveStep, setCurrentActiveStep] = useState<number>(0)
  const [playerAction, setPlayerAction] = useState<string>('Start')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [audioBuffers, setAudioBuffers] = useState<[AudioBuffer] | undefined>(undefined)
  const [audioSources, setAudioSources] = useState<[AudioBufferSourceNode] | undefined>(undefined)

  const getSamples = async () => {
    try {
      const { data, error } = await supabase.storage.from('kicks').list()
      if (error) {
        console.error('Error fetching bucket content:', error.message)
      } else {
        const signedUrlsResponses = getSignedUrlsResponses(data)
        const signedUrls: Array<AudioInfo> = await Promise.all(signedUrlsResponses)

        const completeAudioInfo = await getCompleteAudioInfo(signedUrls)

        console.log('COMPLETE AUDIO INFO: ', completeAudioInfo)
      }
    } catch (e) {
      console.error('SUPABASE ERROR: ', e)
    }
  }

  const playSequence = (bpmChangeWhilePlaying = false) => {
    if (bpm > 0) {
      const interval = 60000 / bpm / 4
      setCurrentActiveStep((prev) => {
        let step: number
        if (bpmChangeWhilePlaying) {
          step = prev
        } else {
          prev === 16 ? (step = 1) : (step = prev + 1)
        }
        return step
      })
      setTimeoutId(setTimeout(playSequence, interval))
    }
  }

  const handleStartStop = () => {
    if (playerAction === 'Start' && bpm > 0) {
      clearTimeout(timeoutId)
      playSequence()
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
        playSequence(true)
      }
    }
  }, [bpm])

  useEffect(() => {
    getSamples()
  }, [])

  return (
    <>
      <button onClick={handleStartStop}>{playerAction}</button>
      <div className="grid grid-cols-16 gap-2">
        {steps.map((step) => {
          const stepIsActive = activatedSteps.includes(step)
          return (
            <div
              key={step}
              className={`border border-black rounded px-2 py-1 cursor-pointer bg ${
                step === currentActiveStep ? 'bg-red-400' : ''
              } ${stepIsActive ? 'bg-black' : 'hover:bg-slate-300'}`}
              onClick={() => handleActivatedSteps(step)}
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
