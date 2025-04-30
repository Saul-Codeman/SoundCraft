function AccountForm({
  handleSubmit,
  email,
  password,
  setEmail,
  setPassword,
  error,
  signedIn,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-xl w-full transition-all duration-300"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {signedIn ? "Welcome Back" : "Create Account"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="text-black w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder={signedIn ? "Enter Password" : "Create New Password"}
        className="text-black w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-300"
      >
        {signedIn ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}

export default AccountForm;
