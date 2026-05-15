// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Database se live polls fetch karne ka logic
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/polls', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Database se aane wale polls ko array state me set karenge
        setPolls(res.data || []);
      } catch (err) {
        console.error("Error fetching deployment matrices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Aggregated calculations for top counters
  const totalPolls = polls.length;
  const activeStreams = polls.filter(p => new Date(p.expiresAt) > new Date()).length;
  
  // Total votes calculate karne ka simple dynamic logic
  const totalVotes = polls.reduce((acc, currentPoll) => {
    const pollVotes = currentPoll.questions?.reduce((qAcc, q) => qAcc + (q.responses?.length || 0), 0) || 0;
    return acc + pollVotes;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HERO BANNER SECTION */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Workspace Control Center</h1>
          </div>
          <p className="text-slate-400 text-xs">Monitor continuous socket events and manage audience feedback structures.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-lg shadow-rose-600/10 transition-all cursor-pointer shrink-0"
        >
          + Create New Poll Matrix
        </button>
      </div>

      {/* METRICS COUNTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Total Configurations</p>
            <p className="text-4xl font-black mt-1 text-white">{totalPolls}</p>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400">📊</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Active Streams</p>
            <p className="text-4xl font-black mt-1 text-green-400">{activeStreams}</p>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-green-500">📈</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Aggregated Responses</p>
            <p className="text-4xl font-black mt-1 text-rose-500">{totalVotes}</p>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-rose-500">👥</div>
        </div>
      </div>

      {/* DYNAMIC POLL CARDS MATRIX LOOP */}
      {polls.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-950/20 p-12 rounded-2xl text-center space-y-4">
          <p className="text-slate-500 text-sm">No active structures detected in this system deployment.</p>
          <button 
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            + Initialize First Form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <div 
              key={poll._id} 
              className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700/60 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">{poll.title}</h3>
                  <span className={`text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded border ${
                    new Date(poll.expiresAt) > new Date() 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {new Date(poll.expiresAt) > new Date() ? 'Active' : 'Closed'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{poll.description || 'No contextual documentation provided.'}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-medium font-mono">
                  Expires: {new Date(poll.expiresAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/poll/${poll._id}`)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition-all cursor-pointer"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => navigate(`/analytics/${poll._id}`)}
                    className="px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}