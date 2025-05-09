function Navbar() {
  return (
    <nav className="-mt-4 mb-3 bg-zinc-900 rounded-xl text-softWhite px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-orange">
        <a href="/">🎵</a>
      </div>
      <div className="space-x-4">
        <a href="/" className="hover:text-blue transition">
          Home
        </a>
        <a href="/login" className="hover:text-blue transition">
          Login/Signup
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
