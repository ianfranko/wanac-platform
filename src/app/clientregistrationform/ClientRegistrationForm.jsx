// src/components/forms/
"use client";

import { useState } from "react";

export default function ClientRegistrationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    profilePicture: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Form Submitted", form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="input" />
      <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="input" />
      <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="input" />
      <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} className="input" />
      <input name="profilePicture" type="file" onChange={handleChange} className="input" />
      <button type="submit" className="btn-primary">Register</button>
    </form>
  );
}
