function SearchPreviews({ source, onAudioFileChange }) {
  return (
    <div className="p-4 bg-gray rounded-lg shadow max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search for songs"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchPreviews;
