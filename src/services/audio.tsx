import { AudioInfo } from '../types/audio'

export const audiocontext = new AudioContext()

const addSourceToAudioObjects = (audioObjs: Array<AudioInfo>) => {
  audioObjs.forEach((audioObj) => {
    const source = createSource(audioObj)
    audioObj.source = source
  })
  return audioObjs
}

export const createSource = (audioObj: AudioInfo) => {
  const source = audiocontext.createBufferSource()
  source.buffer = audioObj.buffer
  source.connect(audiocontext.destination)
  return source
}

export const createBuffer = async (audioObj: AudioInfo) => {
  const response = await fetch(audioObj.signedUrl)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audiocontext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

export const getCompleteAudioInfo = async (audioObjs: Array<AudioInfo>) => {
  const loadAudio = async (urlObj: AudioInfo) => {
    const audioBuffer = await createBuffer(urlObj)

    urlObj.buffer = audioBuffer

    return urlObj
  }

  const loadAllAudio = async (urls: Array<AudioInfo>) => {
    for (const urlObj of urls) {
      await loadAudio(urlObj)
    }
  }

  await loadAllAudio(audioObjs)

  addSourceToAudioObjects(audioObjs)

  return audioObjs
}

export const playAudio = async (signedUrl: string) => {
  try {
    const response = await fetch(signedUrl)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audiocontext.decodeAudioData(arrayBuffer)

    const source = audiocontext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audiocontext.destination)

    // Play the audio
    source.start()
    console.log('ERFOLGREICH ABGESPIELT')
  } catch (error) {
    console.error('Error loading or playing audio:', error)
  }
}
