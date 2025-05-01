"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Login successful!", form);
      router.push("/dashboard"); // 👈 Redirect after success (DEV only)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text[#002147] mb-6">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-orange"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-brand-orange"
              }`}
            />
            <div className="text-sm text-right mt-1">
              <button
                type="button"
                className="text-brand-orange hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-brand-blue">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="mr-2"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-brand-orange hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-brand-orange text-white py-2 rounded-md font-semibold hover:bg-orange-500 transition"
          >
            Log In
          </button>
        </form>

        {/* Divider + Google Login */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-brand-blue">Or continue with</p>
          <button className="flex items-center justify-center w-full px-4 py-2 border rounded-md text-brand-blue hover:bg-brand-blue">
            <FcGoogle className="mr-2 text-xl" /> Login with Google
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-sm text-center text-brand-blue mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-brand-orange hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
