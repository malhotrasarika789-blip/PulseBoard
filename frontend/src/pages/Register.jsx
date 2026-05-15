// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  // Yahan fullName ki jagah 'name' kar diya hai taaki backend schema se match ho sake
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration successful! Account container initialized.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl relative z-10">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">Join PulseBoard to organize and track real-time audience data.</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Full Name</label>
            <input 
              type="text" required placeholder="Sarika Malhotra"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Email Address</label>
            <input 
              type="email" required placeholder="name@domain.com"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-700 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold tracking-wide text-sm transition-all duration-200 shadow-lg shadow-rose-600/15 active:scale-[0.99] mt-2">
            Get Started For Free →
          </button>
        </form>

        <div className="border-t border-slate-800/60 mt-6 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Already have an account? <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold hover:underline transition-colors ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}