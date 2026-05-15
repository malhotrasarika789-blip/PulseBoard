// src/pages/PollView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PollView() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/polls/${pollId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPoll(res.data);
      } catch (err) {
        console.error("Error fetching poll data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPollDetails();
  }, [pollId]);

  const handleSelectOption = (qIndex, optionText) => {
    setSelectedOptions({
      ...selectedOptions,
      [qIndex]: optionText
    });
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();

    if (poll?.questions && Object.keys(selectedOptions).length < poll.questions.length) {
      alert("Please answer all required matrices before submission.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Authentication required. Please login again.");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const payload = { 
        answers: selectedOptions 
      };

      await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, payload, config);

      alert("Response Registered In Core Matrix!");
      navigate(`/analytics/${pollId}`); 
    } catch (err) {
      console.error("Submission crash details:", err.response?.data);
      alert(err.response?.data?.message || "Error transmitting response packets.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center p-12 border border-dashed border-slate-800 rounded-2xl text-slate-400">
        Poll structure not found or execution expired.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
      <div>
        <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/20">
          Live Form Open
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight mt-2 uppercase">{poll.title}</h2>
        <p className="text-slate-400 text-xs mt-1">{poll.description}</p>
      </div>

      <form onSubmit={handleVoteSubmit} className="space-y-6">
        {poll.questions?.map((q, qIndex) => (
          <div key={qIndex} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">
              <span className="text-rose-500 font-mono mr-1.5">Q{qIndex + 1}.</span>
              {q.question}
              {q.isMandatory && <span className="text-rose-500 ml-1">*</span>}
            </h3>

            <div className="space-y-2">
              {q.options?.map((opt, oIndex) => {
                const optionString = typeof opt === 'object' ? opt.text : opt;
                const isChecked = selectedOptions[qIndex] === optionString;

                return (
                  <label 
                    key={oIndex}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-rose-600/10 border-rose-500 text-white shadow-md shadow-rose-500/5' 
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    <input 
                      type="radio"
                      name={`question-${qIndex}`}
                      className="accent-rose-500 w-4 h-4 cursor-pointer"
                      checked={isChecked}
                      onChange={() => handleSelectOption(qIndex, optionString)}
                    />
                    {optionString}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <button 
          type="submit"
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-rose-600/10 transition-all active:scale-[0.99] cursor-pointer"
        >
          Submit Secure Feedback Vote
        </button>
      </form>
    </div>
  );
}