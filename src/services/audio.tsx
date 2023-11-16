import { SignedUrlInfo } from "../types/audio";

const audiocontext = new AudioContext();

export const getAudioBuffers = async (signedUrls: Array<SignedUrlInfo>) => {
  const loadAudio = async (url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audiocontext.decodeAudioData(arrayBuffer);
  };

  const loadAllAudio = async (urls: Array<SignedUrlInfo>) => {
    const audioBuffers = await Promise.all(
      urls.map((urlObj) => loadAudio(urlObj.signedUrl))
    );
    return audioBuffers;
  };

  const audioBuffers = await loadAllAudio(signedUrls);
  return audioBuffers;
};
