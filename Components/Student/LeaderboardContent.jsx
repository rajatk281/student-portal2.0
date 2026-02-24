"use client"

import { useState } from "react";

const ACADEMIC_RANKS = [
  { rank: 1, name: "Sarah Jenkins", major: "Computer Science", gpa: 4.00, avatar: "SJ" },
  { rank: 2, name: "Marcus Thorne", major: "Software Engineering", gpa: 3.98, avatar: "MT" },
  { rank: 3, name: "Elena Rodriguez", major: "Data Science", gpa: 3.95, avatar: "ER" },
  { rank: 4, name: "David Chen", major: "Mathematics", gpa: 3.92, avatar: "DC" },
  { rank: 5, name: "Priya Sharma", major: "Information Systems", gpa: 3.88, avatar: "PS" },
];

const YOU = { rank: 12, name: "Alex Rivera (You)", major: "Top 15% this month", gpa: 3.72, avatar: "AR" };

const CODING_ELITE = [
  { rank: 1, name: "Marcus Thorne", tags: ["REACT", "RUST", "TS"], problems: 2480, avatar: "MT" },
  { rank: 2, name: "Jordan Lee", tags: ["PYTHON", "GO"], problems: 2120, avatar: "JL" },
  { rank: 3, name: "Sarah Jenkins", tags: ["JAVA", "C++"], problems: 1945, avatar: "SJ" },
  { rank: 4, name: "Alex Rivera", tags: ["SWIFT", "KOTLIN"], problems: 1822, avatar: "AR" },
  { rank: 5, name: "Priya Sharma", tags: ["JS", "NODE"], problems: 1506, avatar: "PS" },
];

const TAG_COLORS = {
  REACT: "bg-cyan-500/20 text-cyan-400",
  RUST: "bg-orange-500/20 text-orange-400",
  TS: "bg-blue-500/20 text-blue-400",
  PYTHON: "bg-yellow-500/20 text-yellow-400",
  GO: "bg-teal-500/20 text-teal-400",
  JAVA: "bg-red-500/20 text-red-400",
  "C++": "bg-purple-500/20 text-purple-400",
  SWIFT: "bg-orange-500/20 text-orange-400",
  KOTLIN: "bg-violet-500/20 text-violet-400",
  JS: "bg-yellow-500/20 text-yellow-400",
  NODE: "bg-green-500/20 text-green-400",
};

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-teal-500",
  "bg-orange-500", "bg-purple-500", "bg-sky-500",
];

function getAvatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getRankStyle(rank) {
  if (rank === 1) return { border: "border-yellow-500/40", bg: "bg-yellow-500/10", text: "text-yellow-400", ring: "ring-2 ring-yellow-500/50" };
  if (rank === 2) return { border: "border-slate-400/30", bg: "bg-slate-400/10", text: "text-slate-300", ring: "ring-2 ring-slate-400/40" };
  if (rank === 3) return { border: "border-orange-500/30", bg: "bg-orange-500/10", text: "text-orange-400", ring: "ring-2 ring-orange-500/40" };
  return { border: "border-white/[0.06]", bg: "bg-transparent", text: "text-white/40", ring: "" };
}

function Avatar({ initials }) {
  return (
    <div className={`w-10 h-10 ${getAvatarColor(initials)} rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0`}>
      {initials}
    </div>
  );
}

function SolveModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Elite Developer Badge</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="text-white/50 text-sm mb-2">
          You need <span className="text-[#3b6ef8] font-bold">123 more problems</span> to reach Rank #3.
        </p>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
          <div className="h-full bg-[#3b6ef8] rounded-full" style={{ width: "68%" }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[["Easy", "text-green-400", "50 pts"], ["Medium", "text-yellow-400", "100 pts"], ["Hard", "text-red-400", "200 pts"]].map(([d, c, p]) => (
            <div key={d} className="bg-white/5 rounded-xl p-3 text-center">
              <p className={`text-sm font-black ${c}`}>{d}</p>
              <p className="text-white/30 text-[11px] mt-0.5">{p}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#3b6ef8] hover:bg-[#2d5ce0] text-white text-sm font-bold tracking-widest transition-colors"
        >
          START SOLVING
        </button>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [showSolve, setShowSolve] = useState(false);
  const [weekLabel, setWeekLabel] = useState("WEEKLY UPDATE");

  return (
    <div className="flex-1 text-white p-6 px-8 pt-24 font-sans bg-[#0d0d0d] min-h-screen">
      {showSolve && <SolveModal onClose={() => setShowSolve(false)} />}

      {/* ── Top two panels ── */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Academic Rank */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">🏆</span>
              <h2 className="text-white font-bold text-base">Academic Rank</h2>
            </div>
            <button
              onClick={() => setWeekLabel(weekLabel === "WEEKLY UPDATE" ? "MONTHLY" : "WEEKLY UPDATE")}
              className="bg-[#3b6ef8]/15 border border-[#3b6ef8]/30 text-[#3b6ef8] text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-lg hover:bg-[#3b6ef8]/25 transition-colors"
            >
              {weekLabel}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {ACADEMIC_RANKS.map((s) => {
              const rs = getRankStyle(s.rank);
              return (
                <div key={s.rank} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${rs.border} ${rs.bg}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${rs.text} ${rs.ring} bg-black/30 shrink-0`}>
                    {s.rank}
                  </div>
                  <Avatar initials={s.avatar} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-white/30 text-[11px] truncate">{s.major}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-black text-base ${s.rank <= 3 ? rs.text : "text-white"}`}>{s.gpa.toFixed(2)}</p>
                    <p className="text-white/25 text-[9px] tracking-widest">GPA</p>
                  </div>
                </div>
              );
            })}

            {/* You */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#3b6ef8]/40 bg-[#3b6ef8]/10 mt-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-[#3b6ef8] bg-[#3b6ef8]/20 shrink-0">
                {YOU.rank}
              </div>
              <Avatar initials={YOU.avatar} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{YOU.name}</p>
                <p className="text-[#3b6ef8] text-[11px]">{YOU.major}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-base text-[#3b6ef8]">{YOU.gpa.toFixed(2)}</p>
                <p className="text-[#3b6ef8]/50 text-[9px] tracking-widest">YOUR SCORE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coding Elite */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💻</span>
              <h2 className="text-white font-bold text-base">Coding Elite</h2>
            </div>
            <span className="bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-lg">
              REAL-TIME
            </span>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {CODING_ELITE.map((s) => (
              <div key={s.rank} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.04] hover:border-white/10 transition-colors">
                <p className="text-white/20 text-sm font-black w-6 shrink-0 text-center">
                  {String(s.rank).padStart(2, "0")}
                </p>
                <Avatar initials={s.avatar} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{s.name}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {s.tags.map((t) => (
                      <span key={t} className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${TAG_COLORS[t] || "bg-white/10 text-white/50"}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-base text-white">{s.problems.toLocaleString()}</p>
                  <p className="text-white/25 text-[9px] tracking-widest">PROBLEMS</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div className="mt-3 flex items-center gap-3 bg-[#3b6ef8]/10 border border-[#3b6ef8]/20 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#3b6ef8]/20 flex items-center justify-center shrink-0">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#3b6ef8" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold">Elite Developer Badge</p>
              <p className="text-white/35 text-[11px] mt-0.5">Only 123 problems to Rank #3</p>
            </div>
            <button
              onClick={() => setShowSolve(true)}
              className="bg-[#3b6ef8] hover:bg-[#2d5ce0] text-white text-[10px] font-bold tracking-widest px-3 py-2 rounded-lg shrink-0 transition-colors"
            >
              SOLVE MORE
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}