function EQSliders({ eqBands, eqBandNames, gains, onGainChange }) {
  return (
    <div className="flex gap-6 items-center justify-center w-96 h-32 max-w-full">
      {eqBands.map((band, i) => (
        <div key={band} className="flex flex-col items-center text-xs w-6 m-2">
          <label className="mb-15">{eqBandNames[i]}</label>
          <input
            type="range"
            min="-40"
            max="40"
            step="1"
            value={gains[i]}
            onChange={(e) => onGainChange(i, parseFloat(e.target.value))}
            className="appearance-none w-28 h-0.75 rotate-[-90deg] bg-cyan-500"
          />
        </div>
      ))}
    </div>
  );
}
export default EQSliders;
