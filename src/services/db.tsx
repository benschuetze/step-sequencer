import { supabase } from "../../supabase";

interface SignedUrlInfo {
  name: string;
  signedUrl: string;
  error: boolean;
}

export const getSignedUrlsResponses = (data) => {
  const signedUrlsResponses = data.map(async (sample) => {
    const { data: urlData, error: signError } = await supabase.storage
      .from("kicks")
      .createSignedUrl(sample.name, 60);

    let signedUrlData: SignedUrlInfo;

    if (signError) {
      signedUrlData = {
        name: "",
        signedUrl: "",
        error: true,
      };

      console.error(
        `Error creating signed URL for ${sample.name}:`,
        signError.message
      );

      return signedUrlData;
    } else {
      signedUrlData = {
        name: sample.name || "",
        signedUrl: urlData.signedUrl || "",
        error: false,
      };

      return signedUrlData;
    }
  });
  return signedUrlsResponses;
};
