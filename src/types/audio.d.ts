export type AudioInfo = {
  name: string
  signedUrl: string
  error: boolean
  buffer: AudioBuffer | null
  source?: AudioBufferSourceNode
}
