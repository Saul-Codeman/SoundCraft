function EQProfileList({ eqProfiles, handleProfileChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">EQ Profiles</h2>
      <ul>
        {Object.entries(eqProfiles).map(([profileName, gains]) => (
          <li>
            <button
              key={profileName}
              className="w-full px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-md transition duration-200 text-sm font-medium mb-2"
              onClick={() => handleProfileChange(profileName)}
            >
              {profileName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EQProfileList;
