import { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import EQSliders from "./EQSliders";

const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const eqBandNames = [
  "32Hz",
  "64Hz",
  "125Hz",
  "250Hz",
  "500Hz",
  "1KHz",
  "2KHz",
  "4KHz",
  "8KHz",
  "16KHz",
];
// Link to WaveSurfer: https://wavesurfer.xyz/examples/?webaudio.js
function AudioPlayer({ source, sourceName }) {
  const waveformRef = useRef(null);
  const filtersRef = useRef([]);
  const [gains, setGains] = useState(eqBands.map(() => 0));
  const playerTitle = sourceName || "Audio Player";

  useEffect(() => {
    if (!source) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#888",
      progressColor: "#06b6d4",
      url: source,
      mediaControls: true,
    });

    wavesurfer.on("click", () => wavesurfer.playPause());

    wavesurfer.once("play", () => {
      // Create Web Audio context
      const audioContext = new AudioContext();

      // Create a biquad filter for each band
      const filters = eqBands.map((band) => {
        const filter = audioContext.createBiquadFilter();
        filter.type =
          band <= 32 ? "lowshelf" : band >= 16000 ? "highshelf" : "peaking";
        filter.gain.value = 0;
        filter.Q.value = 1; // resonance
        filter.frequency.value = band; // the cut-off frequency
        return filter;
      });

      const audio = wavesurfer.getMediaElement();
      const mediaNode = audioContext.createMediaElementSource(audio);

      // Connect the filters and media node sequentially
      const equalizer = filters.reduce((prev, curr) => {
        prev.connect(curr);
        return curr;
      }, mediaNode);

      // Connect the filters to the audio output
      equalizer.connect(audioContext.destination);

      filtersRef.current = filters;
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [source]);

  const handleGainChange = (index, value) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = value;
    }
  };

  return (
    <div className="p-12 bg-zinc-900 text-white rounded-xl shadow-md max-w-3xl mx-auto mb-4">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">
        🎵 {playerTitle}
      </h2>
      <div ref={waveformRef}></div>
      <div className="flex gap-2 justify-center">
        {source && (
          <EQSliders
            eqBands={eqBands}
            eqBandNames={eqBandNames}
            gains={gains}
            onGainChange={handleGainChange}
          />
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;
