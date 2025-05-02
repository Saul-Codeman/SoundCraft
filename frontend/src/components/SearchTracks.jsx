import { useState, useEffect } from "react";
import axios from "axios";

function SearchTracks({ onAudioFileChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = () => {
    axios
      .get(`http://localhost:3000/api/tracks?search=${query}`)
      .then((res) => {
        setResults(res.data);
        setShowDropdown(true);
      })
      .catch((err) => console.error(err));
  };

  const handleSelect = (track) => {
    onAudioFileChange({ url: track.s3_audio_url, name: track.name });
    setQuery(track.name);
    setShowDropdown(false);
  };

  return (
    <div className="p-4 bg-gray rounded-lg shadow max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search for songs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray border border-gray-300 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto">
          {results.map((track) => (
            <li
              key={track.id}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(track)}
            >
              {track.name} – {track.artist_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchTracks;
