// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Token solid tariqe se memory me clean save hoga
      localStorage.setItem('token', res.data.token);
      
      alert("Access Granted! Syncing Core Engine...");
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambient Glows matching Cyber Rose Theme */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-rose-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl relative z-10">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">Enter your credentials to access your live analytics dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Email Address</label>
            <input 
              type="email" required placeholder="name@domain.com"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-800 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-800 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold tracking-wide text-sm transition-all duration-200 shadow-lg shadow-rose-600/15 active:scale-[0.99] mt-2 cursor-pointer">
            Sign In to Platform →
          </button>
        </form>

        <div className="border-t border-slate-800/60 mt-6 pt-4 text-center">
          <p className="text-xs text-slate-400">
            New to PulseBoard? <Link to="/register" className="text-rose-400 hover:text-rose-300 font-semibold hover:underline transition-colors ml-1">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}