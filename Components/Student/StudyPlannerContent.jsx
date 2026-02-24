"use client"

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Upload, Sparkles, FileText, Video, AlertTriangle, BookOpen, Zap, Copy, Share2, Settings, Library, X } from 'lucide-react';

const AIStudyDashboard = () => {
    const [focusTime, setFocusTime] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('BEGINNER');
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive && focusTime > 0) {
            interval = setInterval(() => {
                setFocusTime((time) => time - 1);
            }, 1000);
        } else if (focusTime === 0) {
            setIsActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, focusTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
        setFocusTime(25 * 60);
        setIsActive(false);
    };

    const progress = 1 - (focusTime / (25 * 60));
    const circumference = 2 * Math.PI * 100;
    const strokeDashoffset = circumference - (progress * circumference);

    const resources = [
        {
            id: 1,
            title: 'Quantum Mechanics Part 4',
            type: 'video',
            status: 'TO WATCH',
            duration: 'Video • 45 mins',
            badge: 'AI SUMMARY'
        },
        {
            id: 2,
            title: 'Linear Algebra Handouts',
            type: 'document',
            status: 'COMPLETED',
            pages: 'Document • 12 pages',
            badge: 'AI SUMMARY'
        },
    ];

    const weekData = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 68 },
        { day: 'Wed', value: 52 },
        { day: 'Thu', value: 75 },
        { day: 'Fri', value: 95 },
        { day: 'Sat', value: 62 },
        { day: 'Sun', value: 70 },
    ];

    return (
        <div className="min-h-screen bg-black/10 text-white p-4 md:p-6 lg:p-8 font-['SF_Pro_Display',system-ui,sans-serif] antialiased overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto mt-20">

                {/* Main Grid - Optimized for single page view */}
                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-5 h-[calc(100vh-160px)]">
                    {/* Left Column */}
                    <div className="space-y-4 lg:space-y-5">
                        {/* Vault Popup */}
                        {isVaultOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                                <div
                                    className="bg-slate-900/90 border border-slate-700/50 rounded-3xl p-6 lg:p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-300"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setIsVaultOpen(false)}
                                        className="absolute top-6 right-6 w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl flex items-center justify-center transition-all group"
                                    >
                                        <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </button>

                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Resource Vault</h2>
                                            <p className="text-slate-400 text-sm">Access and organize your saved study materials</p>
                                        </div>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                                            <Plus className="w-4 h-4" />
                                            Add Resource
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {resources.map((resource) => (
                                            <div
                                                key={resource.id}
                                                className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 hover:border-blue-500/40 hover:bg-slate-800/40 transition-all group/item cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-slate-700/50 transition-colors">
                                                        {resource.type === 'video' ? (
                                                            <Video className="w-6 h-6 text-red-400" />
                                                        ) : (
                                                            <FileText className="w-6 h-6 text-blue-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white text-sm font-bold truncate mb-1">{resource.title}</h3>
                                                        <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            {resource.badge}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-slate-500 text-xs">{resource.type === 'video' ? resource.duration : resource.pages}</p>
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${resource.status === 'COMPLETED'
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                        }`}>
                                                        {resource.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Test Generator - Compact Version */}
                        <div className="bg-gradient-to-br from-purple-950/30 via-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 lg:p-5 shadow-2xl hover:shadow-purple-900/10 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 lg:w-9 h-8 lg:h-9 bg-purple-500/15 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 lg:w-4.5 h-4 lg:h-4.5 text-purple-400" />
                                </div>
                                <h2 className="text-base lg:text-lg font-bold text-white/90">AI Test Generator</h2>
                            </div>

                            <div className="space-y-3">
                                {/* Compact Upload */}
                                <div>
                                    <label className="text-slate-500 text-[10px] font-semibold mb-1.5 block uppercase tracking-wider">TARGET FILE</label>
                                    <div className="bg-slate-950/60 border-2 border-dashed border-slate-800 rounded-xl p-6 lg:p-8 text-center hover:border-blue-500/40 transition-all cursor-pointer group/upload">
                                        <Upload className="w-6 lg:w-7 h-6 lg:h-7 text-slate-700 group-hover/upload:text-slate-500 mx-auto mb-1.5 transition-colors" />
                                        <p className="text-slate-500 text-[10px] lg:text-xs">Click to upload or drag & drop</p>
                                    </div>
                                </div>

                                {/* Compact Selectors */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="text-slate-500 text-[10px] font-semibold mb-1.5 block uppercase tracking-wider">DIFFICULTY</label>
                                        <select
                                            value={selectedDifficulty}
                                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                                            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                                        >
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                            <option value="EXPERT">Expert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-500 text-[10px] font-semibold mb-1.5 block uppercase tracking-wider">FORMAT</label>
                                        <select className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer">
                                            <option>MCQs</option>
                                            <option>True/False</option>
                                            <option>Short Answer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 lg:py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-600/30">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs lg:text-sm">Generate Test</span>
                                </button>
                            </div>
                        </div>

                        {/* Resources Toggle Button */}
                        <div className="pt-2">
                            <button
                                onClick={() => setIsVaultOpen(true)}
                                className="flex items-center gap-3 px-5 py-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white transition-all group shadow-xl shadow-blue-900/5"
                            >
                                <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <Library className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold">Resources</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{resources.length} Saved Items</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 lg:space-y-5">
                        {/* Focus Lab - Compact Timer */}
                        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 lg:p-5 shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base lg:text-lg font-bold text-white/90">FOCUS LAB</h2>
                                <div className="flex gap-1.5">
                                    <button className="bg-blue-600 text-white px-2.5 lg:px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-blue-600/30">
                                        POMODORO
                                    </button>
                                    <button className="bg-slate-950/60 border border-slate-800 text-slate-400 px-2.5 lg:px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-slate-800/50 transition-all">
                                        DEEP
                                    </button>
                                </div>
                            </div>

                            {/* Compact Timer */}
                            <div className="flex justify-center mb-5">
                                <div className="relative w-[220px] h-[220px] lg:w-[240px] lg:h-[240px]">
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle
                                            cx="110"
                                            cy="110"
                                            r="85"
                                            stroke="rgb(15 23 42)"
                                            strokeWidth="10"
                                            fill="none"
                                            className="lg:hidden"
                                        />
                                        <circle
                                            cx="120"
                                            cy="120"
                                            r="90"
                                            stroke="rgb(15 23 42)"
                                            strokeWidth="10"
                                            fill="none"
                                            className="hidden lg:block"
                                        />
                                        <circle
                                            cx="110"
                                            cy="110"
                                            r="85"
                                            stroke="url(#blueGradient)"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 85}
                                            strokeDashoffset={2 * Math.PI * 85 * (1 - progress)}
                                            strokeLinecap="round"
                                            className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] lg:hidden"
                                        />
                                        <circle
                                            cx="120"
                                            cy="120"
                                            r="90"
                                            stroke="url(#blueGradient)"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 90}
                                            strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
                                            strokeLinecap="round"
                                            className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] hidden lg:block"
                                        />
                                        <defs>
                                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#60a5fa" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-4xl lg:text-5xl font-bold tracking-tight mb-0.5">{formatTime(focusTime)}</div>
                                        <div className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                            {isActive ? 'ACTIVE' : 'PAUSED'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compact Controls */}
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={resetTimer}
                                    className="w-10 h-10 bg-slate-950/60 border border-slate-800 hover:bg-slate-800/50 rounded-xl flex items-center justify-center transition-all"
                                >
                                    <RotateCcw className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
                                >
                                    {isActive ? (
                                        <Pause className="w-5 h-5" fill="white" />
                                    ) : (
                                        <Play className="w-5 h-5 ml-0.5" fill="white" />
                                    )}
                                </button>
                                <button className="w-10 h-10 bg-slate-950/60 border border-slate-800 hover:bg-slate-800/50 rounded-xl flex items-center justify-center transition-all">
                                    <RotateCcw className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIStudyDashboard;