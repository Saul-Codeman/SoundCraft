function TrackListElement({ track, onSelect }) {
  return (
    <li
      key={track.id}
      className="flex items-center gap-4 px-4 py-2 hover:bg-blue-100 cursor-pointer"
      onClick={() => onSelect(track)}
    >
      <img
        src={track.album_image}
        alt={track.name}
        className="w-10 h-10 object-cover rounded"
      />
      <div>
        <div className="font-medium">{track.name}</div>
        <div className="text-sm text-gray-600">{track.artist_name}</div>
      </div>
    </li>
  );
}

export default TrackListElement;
