import { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import EQSliders from "./EQSliders";
import EQProfileList from "./EQProfileList";

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
const amplifyGains = (gains, factor = 1.3) => {
  return gains.map((gain) => Math.min(Math.max(gain * factor, -40), 40)); // Clamps the gain between -40 and 40
};
// prettier-ignore
const eqProfiles = {
  "Flat": amplifyGains([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  "Bass Boost": amplifyGains([6, 5, 4, 2, 1, 0, -1, -2, -2, -3]),
  "Treble Boost": amplifyGains([-2, -2, -1, 0, 0, 1, 2, 4, 5, 6]),
  "V-Shape": amplifyGains([4, 3, 1, -2, -3, -2, 1, 3, 4, 5]),
  "Vocal Boost": amplifyGains([-2, -1, 0, 2, 3, 4, 3, 2, 0, -1]),
  "Lounge": amplifyGains([3, 2, 1, 0, -1, 0, 1, 2, 3, 4]),
  "Classical": amplifyGains([0, 0, 1, 2, 2, 2, 1, 1, 0, 0]),
  "Pop": amplifyGains([-1, 1, 3, 4, 2, 0, 1, 3, 4, 5]),
  "Rock": amplifyGains([4, 3, 2, 1, 0, 1, 2, 3, 2, 1]),
  "Dance": amplifyGains([5, 4, 3, 1, 0, 1, 3, 4, 5, 6]),
};
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

  const handleProfileChange = (profile) => {
    const selectedProfile = eqProfiles[profile];
    if (selectedProfile) {
      setGains(selectedProfile);
    }

    selectedProfile.forEach((value, index) => {
      if (filtersRef.current[index]) {
        filtersRef.current[index].gain.value = value;
      }
    });
  };

  return (
    source && (
      <div className="flex gap-4 max-w-6xl mx-auto">
        <div className="flex-1 p-12 bg-zinc-900 text-white rounded-xl shadow-md mb-4">
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
        <div className="w-[250px] p-6 bg-zinc-900 text-white rounded-xl shadow-md mb-4">
          <EQProfileList
            eqProfiles={eqProfiles}
            handleProfileChange={handleProfileChange}
          />
        </div>
      </div>
    )
  );
}

export default AudioPlayer;
