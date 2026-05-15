import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', isMandatory: true, options: ['', ''] }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', isMandatory: true, options: ['', ''] }]);
  };

  const handleQuestionText = (index, val) => {
    const copy = [...questions];
    copy[index].question = val;
    setQuestions(copy);
  };

  const handleOptionText = (qIndex, oIndex, val) => {
    const copy = [...questions];
    copy[qIndex].options[oIndex] = val;
    setQuestions(copy);
  };

  const addOption = (qIndex) => {
    const copy = [...questions];
    copy[qIndex].options.push('');
    setQuestions(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a Poll Title!");
      return;
    }
    if (!expiresAt) {
      alert("Please select an Expiration Cut-off date and time!");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`Question #${i + 1} statement cannot be left empty!`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          alert(`Option #${j + 1} in Question #${i + 1} cannot be left empty!`);
          return;
        }
      }
    }

    try {
      const payload = { 
        title, 
        description, 
        allowAnonymous: isAnonymous, 
        expiresAt, 
        questions 
      };
      
      await axios.post('http://localhost:5000/api/polls/create', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      alert("New Poll Matrix Successfully Deployed!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deploying structure config.");
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6 transition-all">
      <div>
        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Setup Live Poll
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Deploy automated dynamic templates to catch instantaneous socket feedback loops.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Poll Title</label>
            <input 
              type="text" placeholder="e.g., UI Architecture Preference Study"
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500/80 transition-all duration-200"
              value={title} onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Context Description</label>
            <textarea 
              placeholder="Provide a brief target summary for respondents..."
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500/80 h-20 resize-none transition-all duration-200"
              value={description} onChange={e => setDescription(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 items-center">
          <label className="flex items-center gap-3 cursor-pointer text-slate-300 text-xs font-semibold select-none">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded accent-rose-500 bg-slate-950 border-slate-800" 
              checked={isAnonymous} 
              onChange={e => setIsAnonymous(e.target.checked)} 
            />
            Enable Anonymous Mode Matrix
          </label>
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Expiration Cut-off</label>
            <input 
              type="datetime-local" 
              className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs w-full focus:outline-none focus:border-blue-500 transition-all" 
              value={expiresAt} 
              onChange={e => setExpiresAt(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-5 pt-2">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <input 
                  type="text" placeholder={`Question Statement #${qIndex + 1}`}
                  className="w-full p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                  value={q.question} onChange={e => handleQuestionText(qIndex, e.target.value)}
                />
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5 shrink-0 px-2 select-none">
                  <input 
                    type="checkbox" className="accent-rose-500 w-3.5 h-3.5" checked={q.isMandatory} 
                    onChange={e => {
                      const copy = [...questions];
                      copy[qIndex].isMandatory = e.target.checked;
                      setQuestions(copy);
                    }} 
                  /> Required
                </label>
              </div>
              
              <div className="pl-4 space-y-2.5 border-l-2 border-slate-800/80">
                {q.options.map((opt, oIndex) => (
                  <input 
                    key={oIndex} type="text" placeholder={`Option Variant #${oIndex + 1}`}
                    className="w-full p-2.5 bg-slate-900/40 border border-slate-800/40 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-200"
                    value={opt} onChange={e => handleOptionText(qIndex, oIndex, e.target.value)}
                  />
                ))}
                <button 
                  type="button" onClick={() => addOption(qIndex)} 
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors pt-1 block px-1"
                >
                  + Add Option Row
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="button" onClick={addQuestion} 
          className="w-full py-3 bg-slate-950/20 hover:bg-slate-950/60 border-dashed border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all duration-150"
        >
          + Append New Question Object Card
        </button>

        <button 
          type="submit" 
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm tracking-widest uppercase shadow-lg shadow-rose-600/10 transition-all active:scale-[0.99] cursor-pointer"
        >
          Deploy Live Poll Architecture
        </button>
      </form>
    </div>
  );
}