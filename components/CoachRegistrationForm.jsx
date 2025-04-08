"use client";
import { useState } from "react";

export default function CoachRegistrationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    specialty: "",
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
    console.log("Coach Registered:", form);
    // TODO: Connect to backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-navy mb-4">Coach Registration</h2>
      <input name="fullName" placeholder="Full Name" className="input" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email Address" className="input" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" className="input" onChange={handleChange} required />
      <textarea name="bio" placeholder="Coach Bio" className="input" onChange={handleChange} />
      <input name="specialty" placeholder="Area of Specialty" className="input" onChange={handleChange} />
      <input name="profilePic" type="file" accept="image/*" className="input" onChange={handleChange} />
      <button type="submit" className="btn-primary">Register</button>
    </form>
  );
}
