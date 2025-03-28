export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-brand-navy mb-6">Welcome Back</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-orange text-white py-2 rounded-md font-semibold hover:bg-orange-500 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-brand-orange hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
