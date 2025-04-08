"use client";
import { useState } from "react";

export default function ClientRegistrationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Registered:", form);
    // TODO: Send form data to backend API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-brand-navy mb-4 text-center">
        Client Registration
      </h2>

      <input
        name="fullName"
        placeholder="Full Name"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number (optional)"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
        onChange={handleChange}
      />
  
      <textarea
        name="bio"
        placeholder="Tell us about yourself..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
        onChange={handleChange}
      />
      <input
        name="profilePic"
        type="file"
        accept="image/*"
        className="w-full py-2"
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full bg-brand-orange text-white py-2 rounded-md font-semibold hover:bg-orange-500 transition"
      >
        Register
      </button>
    </form>
  );
}
