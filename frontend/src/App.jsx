// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePoll from './pages/CreatePoll';
import PollView from './pages/PollView';
import PollAnalytics from './pages/PollAnalytics';

export default function App() {
  return (
    <Router>
      {/* Yeh global wrapper ensure karega ki website video jaisi ultra-wide aur sleek dark background me rahe */}
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        
        {/* PREMIUM NAVBAR (Exact Video Style UI) */}
        <nav className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
              <span className="text-base font-black tracking-widest text-white uppercase">
                Pulse<span className="text-rose-500">Board</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-bold text-slate-500 bg-slate-950/60 border border-slate-800/40 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 inline-block"></span>
              Core Node Connected
            </div>
          </div>
        </nav>

        {/* CONTAINER FOR CONTENT */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePoll />} />
            <Route path="/poll/:pollId" element={<PollView />} />
            <Route path="/analytics/:pollId" element={<PollAnalytics />} />
            {/* Default fallback path */}
            <Route path="*" element={<Login />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}