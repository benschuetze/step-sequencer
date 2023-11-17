import { AudioInfo } from '../types/audio'

const audiocontext = new AudioContext()

const addSourceToAudioObjects = (audioObjs: Array<AudioInfo>) => {
  audioObjs.forEach((audioObj) => {
    const source = audiocontext.createBufferSource()
    source.buffer = audioObj.buffer
    source.connect(audiocontext.destination)
    audioObj.source = source
  })
  return audioObjs
}

export const getCompleteAudioInfo = async (audioObjs: Array<AudioInfo>) => {
  const loadAudio = async (urlObj: AudioInfo) => {
    const response = await fetch(urlObj.signedUrl)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audiocontext.decodeAudioData(arrayBuffer)

    urlObj.buffer = audioBuffer

    return urlObj
  }

  const loadAllAudio = async (urls: Array<AudioInfo>) => {
    urls.forEach(async (urlObj) => await loadAudio(urlObj))
  }

  await loadAllAudio(audioObjs)

  addSourceToAudioObjects(audioObjs)

  return audioObjs
}
