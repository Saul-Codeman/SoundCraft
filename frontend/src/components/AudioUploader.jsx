function AudioUploader({ source, onAudioFileChange }) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Upload an Audio File
      </h2>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition">
        Choose File
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const fileURL = URL.createObjectURL(file);
              const fileName = file.name.slice(0, -4);
              onAudioFileChange({ url: fileURL, name: fileName });
            }
          }}
          accept="audio/*"
          className="hidden"
        />
      </label>
    </div>
  );
}

export default AudioUploader;
