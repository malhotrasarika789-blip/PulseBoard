// src/pages/PollAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PollAnalytics() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/polls/${pollId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPoll(res.data);
      } catch (err) {
        console.error("Analytics fetch loop failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
    
    // Optional: Real-time update check intervals
    const interval = setInterval(fetchAnalyticsData, 10000);
    return () => clearInterval(interval);
  }, [pollId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase animate-pulse">
          Streaming live analytical overview...
        </p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="border border-dashed border-slate-800 p-12 rounded-2xl text-center space-y-4">
        <p className="text-slate-400 text-sm">Failed to stream metrics for this execution ID.</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-900 text-xs rounded-xl border border-slate-800 text-white">
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
            Live Stream Engine Active
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1.5 uppercase">
            {poll.title}
          </h2>
          <p className="text-slate-400 text-xs mt-1">{poll.description || 'No context registered.'}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* ANALYTICS CHARTS GENERATOR LAYER */}
      <div className="space-y-6">
        {poll.questions?.map((q, qIndex) => {
          // Dynamic calculation logic for safe votes percentages
          const totalQuestionVotes = q.options?.reduce((acc, opt) => acc + (opt.votes || 0), 0) || 0;

          return (
            <div key={qIndex} className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-base font-bold text-white tracking-tight">
                  <span className="text-rose-500 font-mono mr-2">Q{qIndex + 1}.</span> {q.question}
                </h3>
                <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
                  Total Votes: {totalQuestionVotes}
                </span>
              </div>

              {/* PROGRESS BARS LOOP */}
              <div className="space-y-3.5 pt-2">
                {q.options?.map((opt, oIndex) => {
                  const voteCount = opt.votes || 0;
                  const percentage = totalQuestionVotes > 0 ? Math.round((voteCount / totalQuestionVotes) * 100) : 0;

                  return (
                    <div key={oIndex} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-300 px-1">
                        <span>{opt.text || opt}</span>
                        <span className="font-mono text-rose-400">{voteCount} votes ({percentage}%)</span>
                      </div>
                      {/* Outer Empty Bar Track */}
                      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900/60 relative">
                        {/* Dynamic Filled Fill */}
                        <div 
                          className="h-full bg-gradient-to-r from-rose-600 to-pink-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}