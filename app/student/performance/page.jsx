"use client"

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, ChevronDown, Award, BookOpen, Target, BarChart3, List } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('LAST 12 MONTHS');
  const [showGraph, setShowGraph] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Progression data for the line chart
  const progressionData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 70 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 78 },
    { month: 'Jun', value: 82 },
    { month: 'Jul', value: 80 },
    { month: 'Aug', value: 85 },
    { month: 'Sep', value: 87 },
    { month: 'Oct', value: 88 },
    { month: 'Nov', value: 90 },
    { month: 'Dec', value: 92 },
  ];

  // Custom dot for the line chart
  const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#4f8ef7"
        stroke="#1a1a1a"
        strokeWidth={2}
      />
    );
  };

  // Active dot for the line chart
  const ActiveDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#4f8ef7"
        stroke="#1a1a1a"
        strokeWidth={2}
      />
    );
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowGraph(!showGraph);
      setTimeout(() => {
        setIsFlipping(false);
      }, 300);
    }, 300);
  };

  // Generate contribution data for the past year
  const generateContributionData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (52 * 7));

    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);

        // Generate activity with higher intensity in recent months
        const monthDiff = (today.getMonth() - currentDate.getMonth() + 12) % 12;
        const activityProbability = monthDiff < 4 ? 0.7 : 0.3;
        const hasActivity = Math.random() < activityProbability;
        const level = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;

        weekData.push({
          date: currentDate.toISOString().split('T')[0],
          level: level,
          hours: level * 0.5,
        });
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const [hoveredCell, setHoveredCell] = useState(null);
  const contributionData = generateContributionData();
  const totalHours = contributionData.flat().reduce((sum, day) => sum + day.hours, 0);

  // Subject performance data
  const subjects = [
    {
      name: 'Mathematics',
      score: 92,
      trend: 'up',
      change: '+8%',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: '📊'
    },
    {
      name: 'Physics',
      score: 88,
      trend: 'up',
      change: '+5%',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      icon: '⚛️'
    },
    {
      name: 'Chemistry',
      score: 85,
      trend: 'down',
      change: '-3%',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      icon: '🧪'
    },
    {
      name: 'Biology',
      score: 78,
      trend: 'up',
      change: '+2%',
      color: 'bg-teal-500',
      lightColor: 'bg-teal-500/20',
      borderColor: 'border-teal-500/30',
      icon: '🧬'
    },
    {
      name: 'English',
      score: 94,
      trend: 'up',
      change: '+6%',
      color: 'bg-pink-500',
      lightColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      icon: '📚'
    },
    {
      name: 'History',
      score: 72,
      trend: 'down',
      change: '-5%',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      icon: '🏛️'
    },
  ];

  // Weak subjects (below 80%)
  const weakSubjects = subjects.filter(s => s.score < 80);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const displayMonths = [];
  for (let i = 0; i < 12; i++) {
    displayMonths.push(months[(currentMonth - 11 + i + 12) % 12]);
  }

  const getColor = (level) => {
    switch (level) {
      case 0: return 'bg-white/5';
      case 1: return 'bg-emerald-500/30';
      case 2: return 'bg-emerald-500/50';
      case 3: return 'bg-emerald-500/70';
      case 4: return 'bg-emerald-500';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="space-y-4 mt-25 mx-8">


      {/* Subject Performance Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subject-wise Performance with Flip Animation */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <div
            className={`relative transition-all duration-500 ease-in-out ${isFlipping ? 'animate-flip' : ''
              }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: showGraph ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front Side - Subject List */}
            <div
              className="bg-[#141414] border border-white/5 rounded-2xl p-6"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-xl mb-1">Subject Performance</h2>
                  <p className="text-white/30 text-xs tracking-widest">DETAILED BREAKDOWN</p>
                </div>
                <button
                  onClick={handleFlip}
                  className="flex items-center gap-2 text-white/50 text-xs border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  GRAPH VIEW
                </button>
              </div>

              <div className="space-y-4">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{subject.icon}</span>
                        <span className="text-white text-sm font-semibold">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${subject.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                          {subject.change}
                        </span>
                        {subject.trend === 'up' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className="text-white text-lg font-bold ml-1">{subject.score}</span>
                      </div>
                    </div>
                    <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${subject.color} rounded-full transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Side - Graph View */}
            <div
              className="absolute inset-0 bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-white font-bold text-xl mb-1">Progression Analysis</h2>
                  <p className="text-white/30 text-xs tracking-widest">STANDARDIZED GROWTH METRICS</p>
                </div>
                <button
                  onClick={handleFlip}
                  className="flex items-center gap-2 text-white/50 text-xs border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <List className="w-4 h-4" />
                  LIST VIEW
                </button>
              </div>

              <div className="flex-1 mt-4">
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={progressionData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid
                      vertical={true}
                      horizontal={false}
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 12,
                      }}
                      itemStyle={{ color: "#fff" }}
                      cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4f8ef7"
                      strokeWidth={1.5}
                      dot={<CustomDot />}
                      activeDot={<ActiveDot />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Subjects & Focus Areas */}
        <div className="space-y-4">
          {/* Weak Subjects */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h2 className="text-white font-bold text-xl">Weak Subjects</h2>
            </div>

            <div className="space-y-3">
              {weakSubjects.map((subject, idx) => (
                <div
                  key={idx}
                  className={`${subject.lightColor} border ${subject.borderColor} rounded-xl p-4 hover:bg-opacity-30 transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{subject.icon}</span>
                      <span className="text-white text-sm font-semibold">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xs font-bold">{subject.change}</span>
                      <span className="text-white/70 text-sm font-bold">{subject.score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Target className="w-3 h-3" />
                    <span>Recommended: 2-3 hours daily practice</span>
                  </div>
                </div>
              ))}
            </div>

            {weakSubjects.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-white/40 text-sm">All subjects performing well!</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Performance Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Average Score</span>
                <span className="text-white font-bold text-lg">
                  {(subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Improving Subjects</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {subjects.filter(s => s.trend === 'up').length}/{subjects.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Focus Required</span>
                <span className="text-red-400 font-bold text-lg">
                  {weakSubjects.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;