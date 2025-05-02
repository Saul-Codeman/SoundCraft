import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import AudioUploader from "./AudioUploader";
import SearchTracks from "./SearchTracks";

function AudioContainer() {
  const [audioFile, setAudioFile] = useState({ url: null, name: null });

  return (
    <div>
      <AudioPlayer source={audioFile.url} sourceName={audioFile.name} />
      <AudioUploader onAudioFileChange={setAudioFile} />
      <SearchTracks onAudioFileChange={setAudioFile} />
    </div>
  );
}

export default AudioContainer;
