// src/pages/login.jsx
export default function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login to WANAC</h2>
          <input type="email" placeholder="Email" className="w-full mb-4 p-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full mb-4 p-3 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Login</button>
        </form>
      </div>
    );
  }