import { useState, useEffect } from "react";
import axios from "axios";
import TrackListElement from "./TrackListElement";

function SearchTracks({ onAudioFileChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (trackName) => {
    setQuery(trackName);
    axios
      .get(`http://localhost:3000/api/tracks?search=${query}`)
      .then((res) => {
        setResults(res.data);
        setShowDropdown(true);
      })
      .catch((err) => console.error(err));
  };

  const handleSelect = (track) => {
    axios
      .get(`http://localhost:3000/api/tracks/downloads/${track.id}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        const audioBlob = new Blob([res.data], { type: "audio/mpeg" });
        const localUrl = URL.createObjectURL(audioBlob);
        onAudioFileChange({ url: localUrl, name: track.name });
        setQuery(track.name);
        setShowDropdown(false);
      })
      .catch((err) => console.error("Error downloading track:", err));
  };

  return (
    <div className="p-4 bg-gray rounded-lg shadow max-w-md mx-auto relative">
      <input
        type="text"
        placeholder="Search for songs"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && results.length > 0 && (
        <ul className="w-full z-10 bg-gray border border-gray-300 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto">
          {results.map((track) => (
            <TrackListElement track={track} onSelect={handleSelect} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchTracks;
