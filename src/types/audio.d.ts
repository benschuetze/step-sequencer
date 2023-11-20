export type AudioInfo = {
  name: string
  signedUrl: string
  error: boolean
  buffer: AudioBuffer | null
  source?: AudioBufferSourceNode
  step: number
  activated?: boolean
  hasPlayed?: boolean
}
