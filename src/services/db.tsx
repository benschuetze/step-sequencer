import { supabase } from '../../supabase'
import { AudioInfo } from '../types/audio'

export const getSignedUrlsResponses = (data) => {
  const signedUrlsResponses = data.map(async (sample: { name: string }) => {
    const { data: urlData, error: signError } = await supabase.storage.from('kicks').createSignedUrl(sample.name, 60)

    let signedUrlData: AudioInfo

    if (signError) {
      signedUrlData = {
        name: '',
        signedUrl: '',
        error: true,
      }

      console.error(`Error creating signed URL for ${sample.name}:`, signError.message)

      return signedUrlData
    } else {
      signedUrlData = {
        name: sample.name || '',
        signedUrl: urlData.signedUrl || '',
        error: false,
      }

      return signedUrlData
    }
  })
  return signedUrlsResponses
}
